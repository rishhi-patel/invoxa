project = "invoxa"
env     = "dev"
region  = "eu-west-1"

image_uris = {
  auth     = "857736875915.dkr.ecr.eu-west-1.amazonaws.com/invoxa-dev-auth:latest"
  client   = "857736875915.dkr.ecr.eu-west-1.amazonaws.com/invoxa-dev-client:latest"
  invoice  = "857736875915.dkr.ecr.eu-west-1.amazonaws.com/invoxa-dev-invoice:latest"
  payment  = "857736875915.dkr.ecr.eu-west-1.amazonaws.com/invoxa-dev-payment:latest"
  insights = "857736875915.dkr.ecr.eu-west-1.amazonaws.com/invoxa-dev-insights:latest"
}

lambda_envs = {
  auth = {
    DEBUG          = "true"
    MONGO_URI      = "mongodb+srv://rishhidev:6TcOsmeUIeOkKvtB@cluster0.3jvli.mongodb.net/invoxa?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET     = "your_jwt_secret"
    RESEND_API_KEY = "re_H4YNLDY1_Ne7zAYiGFpsoCj9tsmN1sFw9"
    SERVICE_TOKEN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTUwZDU1OTAyY2MzZTdlYWJhNzQ5NyIsImVtYWlsIjoicmlzaGhpQGV4YW1wbGUxLmNvbSIsImlhdCI6MTc1NDU5OTI0Nn0.YQ8soDNBIhFuI-0U0b-7F3HIDau_O7UTRg_Vwe-my9k"
    FROM_EMAIL     = "noreply@exocodelabs.techs"
  }
  client = {
    DEBUG          = "true"
    MONGO_URI      = "mongodb+srv://rishhidev:6TcOsmeUIeOkKvtB@cluster0.3jvli.mongodb.net/invoxa?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET     = "your_jwt_secret"
    RESEND_API_KEY = "re_H4YNLDY1_Ne7zAYiGFpsoCj9tsmN1sFw9"
    SERVICE_TOKEN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTUwZDU1OTAyY2MzZTdlYWJhNzQ5NyIsImVtYWlsIjoicmlzaGhpQGV4YW1wbGUxLmNvbSIsImlhdCI6MTc1NDU5OTI0Nn0.YQ8soDNBIhFuI-0U0b-7F3HIDau_O7UTRg_Vwe-my9k"
    FROM_EMAIL     = "noreply@exocodelabs.techs"
  }
  invoice = {
    DEBUG          = "true"
    MONGO_URI      = "mongodb+srv://rishhidev:6TcOsmeUIeOkKvtB@cluster0.3jvli.mongodb.net/invoxa?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET     = "your_jwt_secret"
    RESEND_API_KEY = "re_H4YNLDY1_Ne7zAYiGFpsoCj9tsmN1sFw9"
    SERVICE_TOKEN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTUwZDU1OTAyY2MzZTdlYWJhNzQ5NyIsImVtYWlsIjoicmlzaGhpQGV4YW1wbGUxLmNvbSIsImlhdCI6MTc1NDU5OTI0Nn0.YQ8soDNBIhFuI-0U0b-7F3HIDau_O7UTRg_Vwe-my9k"
    FROM_EMAIL     = "noreply@exocodelabs.techs"
  }
  payment = {
    DEBUG          = "true"
    MONGO_URI      = "mongodb+srv://rishhidev:6TcOsmeUIeOkKvtB@cluster0.3jvli.mongodb.net/invoxa?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET     = "your_jwt_secret"
    RESEND_API_KEY = "re_H4YNLDY1_Ne7zAYiGFpsoCj9tsmN1sFw9"
    SERVICE_TOKEN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTUwZDU1OTAyY2MzZTdlYWJhNzQ5NyIsImVtYWlsIjoicmlzaGhpQGV4YW1wbGUxLmNvbSIsImlhdCI6MTc1NDU5OTI0Nn0.YQ8soDNBIhFuI-0U0b-7F3HIDau_O7UTRg_Vwe-my9k"
    FROM_EMAIL     = "noreply@exocodelabs.techs"
  }
  insights = {
    DEBUG          = "true"
    MONGO_URI      = "mongodb+srv://rishhidev:6TcOsmeUIeOkKvtB@cluster0.3jvli.mongodb.net/invoxa?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET     = "your_jwt_secret"
    RESEND_API_KEY = "re_H4YNLDY1_Ne7zAYiGFpsoCj9tsmN1sFw9"
    SERVICE_TOKEN  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTUwZDU1OTAyY2MzZTdlYWJhNzQ5NyIsImVtYWlsIjoicmlzaGhpQGV4YW1wbGUxLmNvbSIsImlhdCI6MTc1NDU5OTI0Nn0.YQ8soDNBIhFuI-0U0b-7F3HIDau_O7UTRg_Vwe-my9k"
    FROM_EMAIL     = "noreply@exocodelabs.techs"
  }
}
 