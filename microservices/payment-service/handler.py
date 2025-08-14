# handler.py
import awsgi
from app import create_app

app = create_app()


def v2_to_v1(event):
    """Translate HTTP API v2.0 event into the v1/proxy shape aws-wsgi expects."""
    if not isinstance(event, dict):
        return event

    # Only transform if it's really a v2.0 event
    if event.get("version") != "2.0":
        return event

    rc = event.get("requestContext") or {}
    rc_http = rc.get("http") or {}

    return {
        "resource": event.get("rawPath") or "/",
        "path": event.get("rawPath") or "/",
        "httpMethod": rc_http.get("method", "GET"),
        "headers": event.get("headers") or {},
        "multiValueHeaders": {},
        "queryStringParameters": event.get("queryStringParameters"),
        "multiValueQueryStringParameters": None,
        "pathParameters": event.get("pathParameters"),
        "stageVariables": event.get("stageVariables"),
        "requestContext": {
            "accountId": rc.get("accountId"),
            "apiId": rc.get("apiId"),
            "stage": rc.get("stage"),
            "requestId": rc.get("requestId"),
            "protocol": rc_http.get("protocol"),
            "identity": {"sourceIp": rc_http.get("sourceIp")},
            "authorizer": rc.get("authorizer"),
        },
        "body": event.get("body"),
        "isBase64Encoded": event.get("isBase64Encoded", False),
    }


def handler(event, context):
    # 🔁 convert v2 -> v1 if needed
    event = v2_to_v1(event)
    return awsgi.response(app, event, context)
