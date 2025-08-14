from bson import ObjectId


def to_oid(s: str) -> ObjectId:
    try:
        return ObjectId(s)
    except Exception:
        # if somehow not a valid ObjectId, raise explicit to avoid silent bad filters
        raise ValueError("Invalid ObjectId")
