import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB", "invoxa")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is required")

_client = MongoClient(MONGO_URI)
DB = _client[MONGO_DB]

# shared collections
CLIENTS = DB["clients"]   # from client-service
INVOICES = DB["invoices"]  # from invoice-service
USERS = DB["users"]     # from auth-service (if you ever need it)

# (optional) helpful indexes for analytics speed:
# INVOICES.create_index([("status", 1), ("updatedAt", -1)])
# INVOICES.create_index([("number", 1)], unique=True)
# CLIENTS.create_index([("createdAt", -1)])
