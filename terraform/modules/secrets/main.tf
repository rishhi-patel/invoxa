## === modules/secrets/main.tf ===

# MongoDB connection secret (for external MongoDB)
resource "aws_secretsmanager_secret" "mongodb_credentials" {
  name                    = "${var.prefix}mongodb-credentials"
  description             = "MongoDB connection details for Invoxa application"
  recovery_window_in_days = 7

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "mongodb_credentials" {
  secret_id = aws_secretsmanager_secret.mongodb_credentials.id
  secret_string = jsonencode({
    mongodb_uri = var.mongodb_uri
    database_name = var.database_name
  })
}

# JWT secret for authentication
resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "${var.prefix}jwt-secret"
  description             = "JWT secret for Invoxa authentication"
  recovery_window_in_days = 7

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id = aws_secretsmanager_secret.jwt_secret.id
  secret_string = jsonencode({
    jwt_secret = var.jwt_secret
  })
}

# API Keys secret
resource "aws_secretsmanager_secret" "api_keys" {
  name                    = "${var.prefix}api-keys"
  description             = "API keys for external services"
  recovery_window_in_days = 7

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "api_keys" {
  secret_id = aws_secretsmanager_secret.api_keys.id
  secret_string = jsonencode({
    stripe_secret_key = var.stripe_secret_key
    sendgrid_api_key  = var.sendgrid_api_key
  })
}