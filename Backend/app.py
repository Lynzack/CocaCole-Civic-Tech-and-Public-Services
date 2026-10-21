from flask import Flask
from flask_cors import CORS
from routes.reports_route import reports_bp
from routes.validation_route import validation_bp
from routes.display_route import display_bp
from routes.chatbot_route import chatbot_bp
app = Flask(__name__)

CORS(app)

#Register the reports route
app.register_blueprint(reports_bp)

#Register the validation route
app.register_blueprint(validation_bp)

#Register the display route
app.register_blueprint(display_bp)

#Register the chatbot route
app.register_blueprint(chatbot_bp)


@app.route("/")
def home():
    return {
        "message": "MYSafety backend is running"
    }

if __name__ == "__main__":
    app.run(debug=True)