import hmac
import os
from uuid import UUID

from flask import Blueprint, jsonify, request
from services.validation_service import validate_incident

validation_bp = Blueprint("validation", __name__)


@validation_bp.route(
    "/api/incidents/<incident_id>/validate",
    methods=["POST"]
)
def review_incident(incident_id):
    expected_token = os.getenv("VALIDATION_API_TOKEN", "")

    if not expected_token:
        return jsonify({
            "success": False,
            "message": "Review endpoint is not configured"
        }), 503

    supplied_token = request.headers.get("X-Validation-Token", "")

    if not hmac.compare_digest(supplied_token, expected_token):
        return jsonify({
            "success": False,
            "message": "Unauthorized"
        }), 401

    try:
        incident_id = str(UUID(incident_id))
    except ValueError:
        return jsonify({
            "success": False,
            "message": "Invalid incident ID"
        }), 400

    result = validate_incident(incident_id)

    return jsonify(result["body"]), result["status"]