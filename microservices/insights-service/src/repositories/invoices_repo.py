from datetime import datetime
from bson import ObjectId
from ..db import INVOICES


def count_invoices() -> int:
    return INVOICES.count_documents({})


def sum_paid_between(start: datetime, end: datetime) -> float:
    pipeline = [
        {"$match": {
            "status": "PAID",
            "updatedAt": {"$gte": start, "$lt": end}
        }},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    agg = list(INVOICES.aggregate(pipeline))
    return float(agg[0]["total"]) if agg else 0.0


def sum_pending() -> float:
    pipeline = [
        {"$match": {"status": "SENT"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    agg = list(INVOICES.aggregate(pipeline))
    return float(agg[0]["total"]) if agg else 0.0


def revenue_by_month(start: datetime, end: datetime) -> float:
    pipeline = [
        {"$match": {
            "status": "PAID",
            "updatedAt": {"$gte": start, "$lt": end}
        }},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    agg = list(INVOICES.aggregate(pipeline))
    return float(agg[0]["total"]) if agg else 0.0


def recent_invoice_activity(limit: int = 10):
    """
    Build a recent activity feed from invoices by updatedAt/createdAt.
    """
    docs = INVOICES.find(
        {},
        {
            "number": 1, "status": 1, "total": 1,
            "clientSnapshot.name": 1, "clientSnapshot.company": 1,
            "createdAt": 1, "updatedAt": 1
        }
    ).sort([("updatedAt", -1), ("createdAt", -1)]).limit(limit)
    return list(docs)
