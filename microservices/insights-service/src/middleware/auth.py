import os
from functools import wraps
from typing import Callable
from flask import request, jsonify, g
import jwt

JWT_ALGOS = ["HS256"]


def _jwt_secret():
    # fetch fresh each request so tests / env-switching work
    return os.getenv("JWT_SECRET", "change-me")


def auth_required(fn: Callable):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # optional test bypass if you set INSIGHTS_TEST_USER_ID
        test_uid = os.getenv("INSIGHTS_TEST_USER_ID")
        if test_uid and os.getenv("FLASK_ENV") == "testing":
            g.user_id = test_uid
            return fn(*args, **kwargs)

        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"message": "Unauthorized"}), 401

        token = auth.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, _jwt_secret(), algorithms=JWT_ALGOS)
            g.user_id = str(payload.get("id") or "")
            if not g.user_id:
                return jsonify({"message": "Unauthorized"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return fn(*args, **kwargs)
    return wrapper
