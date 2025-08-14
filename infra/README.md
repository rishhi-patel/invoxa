# 🏗 Infrastructure Setup

Infrastructure as Code for deploying INVOXA's shared API to AWS using Terraform.

## 📁 Structure

```
infra/
└── shared-api/
    ├── backend.tf
    ├── dev.ca.tfvars
    ├── main.tf
    ├── outputs.tf
    ├── variables.tf
    └── README.md
```

- `main.tf`: Core resources (API Gateway, Lambda, IAM roles, integrations, routes)
- `variables.tf`: Input variables for customization
- `backend.tf`: Remote state configuration
- `outputs.tf`: Useful outputs (API endpoints, ARNs)
- `dev.ca.tfvars`: Example variable values for development

## 📌 Features

- **API Gateway (HTTP):** Single shared API for all services
- **Lambda (Container):** One Lambda per service, deployed from container images
- **IAM Roles:** Per-service Lambda execution roles
- **Dynamic Routing:** Automatic route and integration for each service
- **Environment Variables:** Configurable per Lambda
- **Terraform Modules:** Easily extendable for new services

## 🛠 Tech Stack

- Terraform (>= 1.6)
- AWS (API Gateway v2, Lambda, IAM)
- Container-based Lambda functions

## 🚀 Deployment

```bash
cd infra/shared-api
terraform init
terraform apply -var-file="dev.ca.tfvars"
```

## ⚡ How It Works

- Define your service images and environment variables in `dev.ca.tfvars`.
- Each service gets:
  - A dedicated Lambda (container image)
  - IAM role with basic execution policy
  - API Gateway route: `ANY /api/<service>/{proxy+}`
- API Gateway automatically proxies requests to the correct Lambda.

## 🔗 Outputs

After deployment, see `terraform output` for API endpoint URLs and Lambda ARNs.

## 📚 Extending

To add a new service:

1. Add its image URI to `image_uris` in your tfvars file.
2. (Optional) Add environment variables in `lambda_envs`.
3. Run `terraform apply`.
