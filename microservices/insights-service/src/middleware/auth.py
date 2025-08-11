import os
from functools import wraps
from typing import Callable
from flask import request, jsonify, g
import jwt


JWT_SECRET = os.getenv("JWT_SECRET", "change-me")  # match auth-service
JWT_ALGOS = ["HS256"]


def auth_required(fn: Callable):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # test/dev bypass (optional)
        test_uid = os.getenv("INSIGHTS_TEST_USER_ID")
        if test_uid and os.getenv("FLASK_ENV") == "testing":
            g.user_id = test_uid
            return fn(*args, **kwargs)

        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"message": "Unauthorized"}), 401

        token = auth.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=JWT_ALGOS)
            # expect your auth-service to put user id in `id`
            g.user_id = str(payload.get("id"))
            if not g.user_id:
                return jsonify({"message": "Unauthorized"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return fn(*args, **kwargs)
    return wrapper
