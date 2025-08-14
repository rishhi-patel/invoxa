# ---- Lambda Python 3.11 runtime ----
FROM public.ecr.aws/lambda/python:3.11

# Lambda executes from /var/task by default
WORKDIR ${LAMBDA_TASK_ROOT}

# 1) Install Python deps
COPY requirements.txt .
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 2) Copy your app code
COPY app.py ./
COPY handler.py ./
COPY src ./src

# 3) Set the handler: <module>.<function>
CMD [ "handler.handler" ]
