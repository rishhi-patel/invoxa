# ---- build/runtime: Lambda Python 3.11 ----
FROM public.ecr.aws/lambda/python:3.11
WORKDIR ${LAMBDA_TASK_ROOT}

# Install deps
COPY requirements.txt .
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy app
COPY src ./

# Handler module/function:
# Matches Terraform handler_commands["insights"] = "handler.handler"
CMD [ "handler.handler" ]
