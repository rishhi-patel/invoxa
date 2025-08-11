from datetime import datetime
from ..db import INVOICES
from ..utils.ids import to_oid


def count_invoices(user_id: str) -> int:
    return INVOICES.count_documents({"createdBy": to_oid(user_id)})


def sum_paid_between(user_id: str, start: datetime, end: datetime) -> float:
    pipeline = [
        {"$match": {
            "createdBy": to_oid(user_id),
            "status": "PAID",
            "updatedAt": {"$gte": start, "$lt": end}
        }},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    agg = list(INVOICES.aggregate(pipeline))
    return float(agg[0]["total"]) if agg else 0.0


def sum_pending(user_id: str) -> float:
    pipeline = [
        {"$match": {"createdBy": to_oid(user_id), "status": "SENT"}},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    agg = list(INVOICES.aggregate(pipeline))
    return float(agg[0]["total"]) if agg else 0.0


def revenue_by_month(user_id: str, start: datetime, end: datetime) -> float:
    pipeline = [
        {"$match": {
            "createdBy": to_oid(user_id),
            "status": "PAID",
            "updatedAt": {"$gte": start, "$lt": end}
        }},
        {"$group": {"_id": None, "total": {"$sum": "$total"}}}
    ]
    agg = list(INVOICES.aggregate(pipeline))
    return float(agg[0]["total"]) if agg else 0.0


def recent_invoice_activity(user_id: str, limit: int = 10):
    docs = (INVOICES
            .find(
                {"createdBy": to_oid(user_id)},
                {
                    "number": 1, "status": 1, "total": 1,
                    "clientSnapshot.name": 1, "clientSnapshot.company": 1,
                    "createdAt": 1, "updatedAt": 1
                }
            )
            .sort([("updatedAt", -1), ("createdAt", -1)])
            .limit(limit))
    return list(docs)
