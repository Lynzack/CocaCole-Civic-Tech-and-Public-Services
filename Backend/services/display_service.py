import logging
import math

from uuid import UUID

from database import supabase


logger = logging.getLogger(__name__)

ALLOWED_CATEGORIES = {
    "rape",
    "assault",
    "sexual harassment",
    "murder",
    "robbery"
}

ALLOWED_VERIFICATION_STATUSES = {
    "verified",
    "unverified"
}

PUBLIC_COLUMNS = (
    "incident_id,"
    "report_number,"
    "incident_type,"
    "incident_date,"
    "incident_time,"
    "public_description,"
    "location_name,"
    "public_latitude,"
    "public_longitude,"
    "approximate_radius_m,"
    "verification_status,"
    "verification_sources,"
    "published_at"
)


def make_result(status, **body):
    return {
        "body": body,
        "status": status
    }


def format_incident(record):
    incident = dict(record)

    distance = incident.get("distance_m")

    incident["distance_m"] = (
        round(float(distance), 1)
        if distance is not None
        else None
    )

    # Frontend can translate these labels into Malay.
    incident["verification_label"] = (
        "Verified"
        if incident["verification_status"] == "verified"
        else "Unverified community report"
    )

    incident["location_is_approximate"] = True

    # The publishing RPC currently stores one source URL as text.
    source_url = incident.get("verification_sources")

    incident["sources"] = (
        [{"url": source_url}]
        if (
            incident["verification_status"] == "verified"
            and isinstance(source_url, str)
            and source_url.strip()
        )
        else []
    )

    return incident


def get_display_incidents(params):
    try:
        category = (
            params.get("category") or ""
        ).strip().lower()

        verification_status = (
            params.get("verification_status") or ""
        ).strip().lower()

        if category == "all":
            category = ""

        if verification_status == "all":
            verification_status = ""

        if category and category not in ALLOWED_CATEGORIES:
            raise ValueError("Invalid incident category")

        if (
            verification_status
            and verification_status
            not in ALLOWED_VERIFICATION_STATUSES
        ):
            raise ValueError(
                "Verification status must be "
                "verified or unverified"
            )

        try:
            limit = int(params.get("limit", "20"))
            offset = int(params.get("offset", "0"))
            radius_m = int(params.get("radius_m", "5000"))

        except (ValueError, TypeError, OverflowError):
            raise ValueError(
                "Limit, offset and radius_m "
                "must be whole numbers"
            )

        if not 1 <= limit <= 100:
            raise ValueError(
                "Limit must be between 1 and 100"
            )

        if not 0 <= offset <= 10000:
            raise ValueError(
                "Offset must be between 0 and 10000"
            )

        if not 50 <= radius_m <= 50000:
            raise ValueError(
                "Search radius must be between "
                "50 and 50000 metres"
            )

        latitude_text = (
            params.get("latitude") or ""
        ).strip()

        longitude_text = (
            params.get("longitude") or ""
        ).strip()

        if bool(latitude_text) != bool(longitude_text):
            raise ValueError(
                "Provide both latitude and longitude"
            )

        latitude = None
        longitude = None

        if latitude_text:
            try:
                latitude = float(latitude_text)
                longitude = float(longitude_text)

            except (ValueError, OverflowError):
                raise ValueError(
                    "Latitude and longitude "
                    "must be valid numbers"
                )

            if not (
                math.isfinite(latitude)
                and math.isfinite(longitude)
                and -90 <= latitude <= 90
                and -180 <= longitude <= 180
            ):
                raise ValueError(
                    "Latitude must be between -90 and 90, "
                    "and longitude between -180 and 180"
                )

    except ValueError as error:
        return make_result(
            400,
            success=False,
            message=str(error)
        )

    try:
        response = (
            supabase
            .rpc(
                "get_display_incidents",
                {
                    "p_category": category or None,
                    "p_verification_status": (
                        verification_status or None
                    ),
                    "p_latitude": latitude,
                    "p_longitude": longitude,
                    "p_radius_m": radius_m,
                    "p_limit": limit,
                    "p_offset": offset
                }
            )
            .execute()
        )

        records = response.data or []

        has_more = len(records) > limit

        incidents = [
            format_incident(record)
            for record in records[:limit]
        ]

        return make_result(
            200,
            success=True,
            mode=(
                "nearby"
                if latitude is not None
                else "latest"
            ),
            incidents=incidents,
            pagination={
                "limit": limit,
                "offset": offset,
                "has_more": has_more,
                "next_offset": (
                    offset + limit
                    if has_more
                    else None
                )
            }
        )

    except Exception:
        logger.exception(
            "Failed to retrieve published incidents"
        )

        return make_result(
            503,
            success=False,
            message=(
                "Published incidents could not be loaded. "
                "Please try again later."
            )
        )


def get_incident_details(incident_id):
    try:
        incident_id = str(UUID(incident_id))

    except (ValueError, TypeError, AttributeError):
        return make_result(
            400,
            success=False,
            message="Invalid incident ID"
        )

    try:
        response = (
            supabase
            .table("published_incidents")
            .select(PUBLIC_COLUMNS)
            .eq("incident_id", incident_id)
            .in_(
                "verification_status",
                ["verified", "unverified"]
            )
            .limit(1)
            .execute()
        )

        if not response.data:
            return make_result(
                404,
                success=False,
                message="Published incident not found"
            )

        incident = format_incident(
            response.data[0]
        )

        return make_result(
            200,
            success=True,
            incident=incident
        )

    except Exception:
        logger.exception(
            "Failed to retrieve published incident %s",
            incident_id
        )

        return make_result(
            503,
            success=False,
            message=(
                "Incident details could not be loaded. "
                "Please try again later."
            )
        )