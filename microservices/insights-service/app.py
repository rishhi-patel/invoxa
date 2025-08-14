from flask import Flask
from flask_cors import CORS
from src.routes.metrics import metrics_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/api/insights/health")
    def health():
        return jsonify(ok=True, service="insights-service")

    @app.get("/api/insights/ping")
    def ping():
        return jsonify(pong=True, q=request.args.get("q", ""))

    app.register_blueprint(metrics_bp, url_prefix="/api/insights")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=3010, debug=True)
