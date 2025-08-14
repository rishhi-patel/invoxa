# tests/conftest.py
import os
import jwt
import pytest
import mongomock
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from freezegun import freeze_time

from app import create_app
import src.db as db  # we'll patch CLIENTS/INVOICES here

JWT_SECRET = os.environ.get("JWT_SECRET", "secret123")
ALG = "HS256"

TEST_USER_ID = "68950d55902cc3e7eaba7497"
OTHER_USER_ID = "68950d55902cc3e7eaba7498"


@pytest.fixture(scope="session")
def app():
    os.environ["FLASK_ENV"] = "testing"
    os.environ["JWT_SECRET"] = JWT_SECRET
    flask_app = create_app()
    return flask_app


@pytest.fixture(autouse=True)
def patch_mongo(monkeypatch):
    # Create a fresh in-memory DB per test
    mongo_client = mongomock.MongoClient()
    test_db = mongo_client["invoxa"]
    monkeypatch.setattr(db, "DB", test_db)
    monkeypatch.setattr(db, "CLIENTS", test_db["clients"])
    monkeypatch.setattr(db, "INVOICES", test_db["invoices"])
    monkeypatch.setattr(db, "USERS", test_db["users"], raising=False)
    yield


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_header():
    def _make(uid=TEST_USER_ID, exp_minutes=60):
        payload = {
            "id": uid,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=exp_minutes)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=ALG)
        return {"Authorization": f"Bearer {token}"}
    return _make


@pytest.fixture
def seed_data():
    """
    Seed:
      - 1 client for TEST_USER_ID
      - 1 invoice SENT (pending)
      - 1 invoice PAID last month
      - 1 invoice PAID this month
      - plus some docs for OTHER_USER_ID to ensure filtering works
    """
    now = datetime(2025, 8, 11, tzinfo=timezone.utc)
    start_of_month = now.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0)

    # Clients
    db.CLIENTS.insert_many([
        {
            "_id": ObjectId("689576e4c8be9a3481fd7934"),
            "name": "Rishhi Patel",
            "email": "patel.rishi3001@gmail.com",
            "phone": "+1-555-123-4567",
            "company": "EXOcode Labs",
            "createdBy": ObjectId(TEST_USER_ID),
            "createdAt": start_of_month,
            "updatedAt": start_of_month,
        },
        {
            "_id": ObjectId(),
            "name": "Other User Client",
            "email": "other@example.com",
            "phone": "000",
            "company": "OtherCo",
            "createdBy": ObjectId(OTHER_USER_ID),
            "createdAt": start_of_month,
            "updatedAt": start_of_month,
        },
    ])

    # Invoices for TEST_USER_ID
    db.INVOICES.insert_many([
        # Pending (SENT) — counted in pendingPayments
        {
            "_id": ObjectId(),
            "clientId": ObjectId("689576e4c8be9a3481fd7934"),
            "createdBy": ObjectId(TEST_USER_ID),
            "number": "INV-PENDING",
            "items": [{"name": "API Dev", "quantity": 8, "unitPrice": 80}],
            "currency": "USD",
            "subtotal": 640,
            "taxRate": 13,
            "taxAmount": 83.2,
            "total": 723.2,
            "status": "SENT",
            "clientSnapshot": {
                "name": "Rishhi Patel",
                "email": "patel.rishi3001@gmail.com",
                "company": "EXOcode Labs"
            },
            "issuedAt": start_of_month,
            "createdAt": start_of_month,
            "updatedAt": start_of_month,
        },
        # Paid last month — used for trends, not "this month"
        {
            "_id": ObjectId(),
            "clientId": ObjectId("689576e4c8be9a3481fd7934"),
            "createdBy": ObjectId(TEST_USER_ID),
            "number": "INV-PAID-LAST",
            "items": [{"name": "Site", "quantity": 1, "unitPrice": 500}],
            "currency": "USD",
            "subtotal": 500,
            "taxRate": 0,
            "taxAmount": 0,
            "total": 500,
            "status": "PAID",
            "clientSnapshot": {"name": "Rishhi Patel", "email": "patel.rishi3001@gmail.com", "company": "EXOcode Labs"},
            "issuedAt": start_of_month,
            "createdAt": start_of_month - timedelta(days=30),
            "updatedAt": start_of_month - timedelta(days=1),  # last month
        },
        # Paid this month — shows in revenueThisMonth + trends
        {
            "_id": ObjectId(),
            "clientId": ObjectId("689576e4c8be9a3481fd7934"),
            "createdBy": ObjectId(TEST_USER_ID),
            "number": "INV-PAID-NOW",
            "items": [{"name": "Support", "quantity": 2, "unitPrice": 150}],
            "currency": "USD",
            "subtotal": 300,
            "taxRate": 0,
            "taxAmount": 0,
            "total": 300,
            "status": "PAID",
            "clientSnapshot": {"name": "Rishhi Patel", "email": "patel.rishi3001@gmail.com", "company": "EXOcode Labs"},
            "issuedAt": start_of_month + timedelta(days=1),
            "createdAt": start_of_month + timedelta(days=1),
            "updatedAt": start_of_month + timedelta(days=2),  # this month
        },
    ])

    # Invoices for OTHER_USER_ID (should be ignored)
    db.INVOICES.insert_one({
        "_id": ObjectId(),
        "clientId": ObjectId(),
        "createdBy": ObjectId(OTHER_USER_ID),
        "number": "INV-OTHER",
        "items": [{"name": "Other", "quantity": 1, "unitPrice": 1}],
        "currency": "USD",
        "subtotal": 1,
        "taxRate": 0,
        "taxAmount": 0,
        "total": 1,
        "status": "PAID",
        "clientSnapshot": {"name": "Other", "email": "other@x.com", "company": "OtherCo"},
        "createdAt": start_of_month,
        "updatedAt": start_of_month,
    })

    return {"now": now}
