from flask import Blueprint, request, jsonify
from services.reports_service import create_report as create_report_service

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/api/reports", methods=["POST"])
def create_report():
    data = request.form.to_dict()
    photo = request.files.get("photo")

    result = create_report_service(data, photo)
    return jsonify(result["body"]), result["status"]