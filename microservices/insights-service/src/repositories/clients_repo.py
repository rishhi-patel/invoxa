from bson import ObjectId
from ..db import CLIENTS


def count_clients() -> int:
    return CLIENTS.count_documents({})


def recent_clients(limit: int = 5):
    cur = CLIENTS.find({}, {"name": 1, "company": 1, "createdAt": 1}).sort(
        "createdAt", -1).limit(limit)
    return list(cur)
