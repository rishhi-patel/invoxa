from flask import Blueprint, request, jsonify
from ..services.insights_service import get_summary_cards, get_revenue_trends, get_recent_activity

metrics_bp = Blueprint("metrics", __name__)


@metrics_bp.get("/summary")
def summary():
    """
    Cards:
      - totalClients
      - totalInvoices
      - revenueThisMonth
      - pendingPayments
    """
    return jsonify(get_summary_cards()), 200


@metrics_bp.get("/revenue-trends")
def revenue_trends():
    months = int(request.args.get("months", 6))
    return jsonify(get_revenue_trends(months=months)), 200


@metrics_bp.get("/recent-activity")
def recent_activity():
    limit = int(request.args.get("limit", 10))
    return jsonify(get_recent_activity(limit=limit)), 200
