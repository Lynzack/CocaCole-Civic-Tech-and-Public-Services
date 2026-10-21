from flask import Blueprint, jsonify, request

from services.display_service import (
    get_display_incidents,
    get_incident_details
)


display_bp = Blueprint("display", __name__)


@display_bp.route("/api/incidents", methods=["GET"])
def display_incidents():
    result = get_display_incidents(request.args)

    return jsonify(result["body"]), result["status"]


@display_bp.route(
    "/api/incidents/<incident_id>",
    methods=["GET"]
)
def display_incident_details(incident_id):
    result = get_incident_details(incident_id)

    return jsonify(result["body"]), result["status"]