from flask import Blueprint, jsonify, request, g
from ..middleware.auth import auth_required
from ..services.insights_service import get_summary_cards, get_revenue_trends, get_recent_activity

metrics_bp = Blueprint("metrics", __name__)


@metrics_bp.get("/summary")
@auth_required
def summary():
    return jsonify(get_summary_cards(g.user_id)), 200


@metrics_bp.get("/revenue-trends")
@auth_required
def revenue_trends():
    months = int(request.args.get("months", 6))
    return jsonify(get_revenue_trends(g.user_id, months=months)), 200


@metrics_bp.get("/recent-activity")
@auth_required
def recent_activity():
    limit = int(request.args.get("limit", 10))
    return jsonify(get_recent_activity(g.user_id, limit=limit)), 200
