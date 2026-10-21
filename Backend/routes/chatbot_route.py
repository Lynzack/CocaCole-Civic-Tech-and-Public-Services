from flask import Blueprint, jsonify, request

from services.chatbot_service import get_chatbot_reply


chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/api/chatbot", methods=["POST"])
def chatbot():
    if not request.is_json:
        return jsonify({
            "success": False,
            "message": "Use Content-Type: application/json"
        }), 415

    data = request.get_json(silent=True)
    result = get_chatbot_reply(data)

    return jsonify(result["body"]), result["status"]