import awsgi  # AWS WSGI adapter
from app import app


def handler(event, context):
    # Converts API Gateway HTTP API event to WSGI and invokes Flask app
    return awsgi.response(app, event, context)
