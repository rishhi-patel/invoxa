import awsgi
from app import create_app

flask_app = create_app()


def handler(event, context):
    return awsgi.response(flask_app, event, context)  # ✅ works in latest awsgi
