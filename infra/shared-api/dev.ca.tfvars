project = "invoxa"
env     = "dev"
region  = "ca-central-1"

image_uris = {
  auth     = "857736875915.dkr.ecr.us-east-1.amazonaws.com/invoxa-dev-auth:latest"
  client   = "857736875915.dkr.ecr.us-east-1.amazonaws.com/invoxa-dev-client:latest"
  invoice  = "857736875915.dkr.ecr.us-east-1.amazonaws.com/invoxa-dev-invoice:latest"
  payment  = "857736875915.dkr.ecr.us-east-1.amazonaws.com/invoxa-dev-payment:latest"
  insights = "857736875915.dkr.ecr.us-east-1.amazonaws.com/invoxa-dev-insights:latest"
}
# If you still use lambda_envs via TF locally, add them here (or prefer SSM/Jenkins as discussed)
