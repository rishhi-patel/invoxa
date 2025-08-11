from bson import ObjectId
from ..db import CLIENTS
from ..utils.ids import to_oid


def count_clients(user_id: str) -> int:
    return CLIENTS.count_documents({"createdBy": to_oid(user_id)})


def recent_clients(user_id: str, limit: int = 5):
    cur = (CLIENTS
           .find({"createdBy": to_oid(user_id)}, {"name": 1, "company": 1, "createdAt": 1})
           .sort("createdAt", -1).limit(limit))
    return list(cur)
