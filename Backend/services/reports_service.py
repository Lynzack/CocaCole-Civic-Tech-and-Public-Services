from uuid import uuid4
from database import supabase
from datetime import datetime
from io import BytesIO
from PIL import Image, UnidentifiedImageError
import re

max_photo_bytes = 5 * 1024 * 1024

allowed_extensions = {"png", "jpg", "jpeg"}

def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in allowed_extensions
    )

def upload_photo(filename, file_bytes, content_type):
    supabase.storage.from_("incident_evidence").upload(
        filename,
        file_bytes,
        {"content-type": content_type}
    )


def create_report(data, photo):

    #extract report data from the request
    incident_type = (data.get("incident_type") or "").strip()
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    location_name = (data.get("location_name") or "").strip()
    radius = data.get("radius")
    incident_datetime = (data.get("incident_datetime") or "").strip()
    description = (data.get("description") or "").strip()

    #report data validation
    if not incident_type:
        return {
            "body": {
                "success": False,
                "message": "Incident type is required"
            },
            "status": 400
        }
    if latitude is None or longitude is None:
        return {
            "body": {
                "success": False,
                "message": "Location is required"
            },
            "status": 400
        }
    if not location_name:
        return {
            "body": {
                "success": False,
                "message": "Location name is required"
            },
            "status": 400
        }
    #     }
    if radius is None:
        return {
            "body": {
                "success": False,
                "message": "Radius is required"
            },
            "status": 400
        }
    if not incident_datetime:
        return {
            "body": {
                "success": False,
                "message": "Incident date and time are required"
            },
            "status": 400
        }
    if not description:
        return {
            "body": {
                "success": False,
                "message": "Description is required"
            },
            "status": 400
        }
    if photo is None or photo.filename == "":
        return {
            "body": {
                "success": False,
                "message": "Evidence photo is required"
            },
            "status": 400
        }
    if not allowed_file(photo.filename):
        return {
            "body": {
                "success": False,
                "message": "Only PNG, JPG, and JPEG files are allowed"
            },
            "status": 400
        }

    photo_bytes = photo.read(max_photo_bytes + 1)

    if not photo_bytes or len(photo_bytes) > max_photo_bytes:
        return {
            "body": {
                "success": False,
                "message": "Photo must be non-empty and no larger than 5 MB"
            },
            "status": 400
        }

    extension = photo.filename.rsplit(".", 1)[1].lower()
    expected_format = {
        "png": "PNG",
        "jpg": "JPEG",
        "jpeg": "JPEG"
    }[extension]

    try:
        with Image.open(BytesIO(photo_bytes)) as image:
            if image.format != expected_format:
                raise ValueError("Image format does not match extension")
            image.verify()

        # Reopen to check that the pixel data can be decoded.
        with Image.open(BytesIO(photo_bytes)) as image:
            image.load()

    except (
        UnidentifiedImageError,
        OSError,
        ValueError,
        SyntaxError,
        Image.DecompressionBombError
    ):
        return {
            "body": {
                "success": False,
                "message": "Photo must be a valid PNG or JPEG image"
            },
            "status": 400
        }

    photo_content_type = Image.MIME[expected_format]
    
    try:
        latitude = float(latitude)
        longitude = float(longitude)
        radius = int(radius)
    except (ValueError, TypeError, OverflowError):
        return {
            "body": {
                "success": False,
                "message": "Latitude, longitude, and radius must be valid numbers"
            },
            "status": 400
        }

    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        return {
            "body": {
                "success": False,
                "message": "Latitude must be between -90 and 90, and longitude between -180 and 180"
            },
            "status": 400
        }

    if not (50 <= radius <= 50000):
        return {
            "body": {
                "success": False,
                "message": "Radius must be between 50 and 50000 metres"
            },
            "status": 400
    }

    try:
        pattern = (
            r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}"
            r"(?::\d{2}(?:\.\d{1,6})?)?"
            r"(?:Z|[+-]\d{2}:\d{2})?"
        )

        if not re.fullmatch(pattern, incident_datetime):
            raise ValueError("Date and time are required")

        parsed_datetime = datetime.fromisoformat(
            incident_datetime.replace("Z", "+00:00")
        )
        incident_datetime = parsed_datetime.isoformat()

    except ValueError:
        return {
            "body": {
                "success": False,
                "message": (
                    "Enter a valid date and time, "
                    "for example 2026-10-18T14:30"
                )
            },
            "status": 400
        }

    photo_filename = f"{uuid4()}.{extension}"
    uploaded = False
    inserted = False
    
    try:
        upload_photo(
            photo_filename,
            photo_bytes,
            photo_content_type
        )
        uploaded = True

        photo_path = photo_filename

        incident_data = {
            "incident_type": incident_type,
            "description": description,
            "incident_date": parsed_datetime.date().isoformat(),
            "incident_time": parsed_datetime.time().isoformat(),
            "media_path": photo_path
        }

        location_data = {
            "reported_latitude": latitude,
            "reported_longitude": longitude,
            "reported_radius_m": radius,
            "location_name": location_name
        }

        response = (
            supabase
            .rpc(
                "create_incident_with_location",
                {
                    "p_incident": incident_data,
                    "p_location": location_data
                }
            )
            .execute()
        )
        inserted = True

        return {
            "body": {
                "success": True,
                "message": "Report submitted successfully",
                "report": response.data
            },
            "status": 201
        }

    except Exception as error:
        print("Error creating report:", error)

        if uploaded:
            print(
                "Photo may need reconciliation:",
                photo_filename
            )

        return {
            "body": {
                "success": False,
                "message": (
                    "Could not confirm report submission. "
                    "Please check your reports before submitting again."
                )
            },
            "status": 500
        }