# AWS Resources Created by Environment

## 📊 **Resource Summary Table**

| **Resource Type** | **DEV Environment** | **PROD Environment** | **Description** |
|---|---|---|---|
| **VPC & NETWORKING** | | | |
| VPC | `INX-DEV-USNV-VPC` | `INX-PRD-USNV-VPC` | Main VPC with DNS support |
| Internet Gateway | `INX-DEV-USNV-IGW` | `INX-PRD-USNV-IGW` | Internet access for public subnets |
| NAT Gateway | `INX-DEV-USNV-NATGW` | `INX-PRD-USNV-NATGW` | Outbound internet for private subnets |
| Elastic IP | `INX-DEV-USNV-EIP` | `INX-PRD-USNV-EIP` | Static IP for NAT Gateway |
| Public Subnet 1 | `INX-DEV-USNV-PBS-us-east-1a` | `INX-PRD-USNV-PBS-us-east-1a` | Public subnet AZ-a |
| Public Subnet 2 | `INX-DEV-USNV-PBS-us-east-1b` | `INX-PRD-USNV-PBS-us-east-1b` | Public subnet AZ-b |
| Public Subnet 3 | `INX-DEV-USNV-PBS-us-east-1c` | `INX-PRD-USNV-PBS-us-east-1c` | Public subnet AZ-c |
| Private Subnet 1 | `INX-DEV-USNV-PVS-us-east-1a` | `INX-PRD-USNV-PVS-us-east-1a` | Private subnet AZ-a |
| Private Subnet 2 | `INX-DEV-USNV-PVS-us-east-1b` | `INX-PRD-USNV-PVS-us-east-1b` | Private subnet AZ-b |
| Private Subnet 3 | `INX-DEV-USNV-PVS-us-east-1c` | `INX-PRD-USNV-PVS-us-east-1c` | Private subnet AZ-c |
| Public Route Table | `INX-DEV-USNV-RT-PUB` | `INX-PRD-USNV-RT-PUB` | Routing for public subnets |
| Private Route Table | `INX-DEV-USNV-RT-PRIV` | `INX-PRD-USNV-RT-PRIV` | Routing for private subnets |
| **SECURITY GROUPS** | | | |
| ALB Security Group | `INX-DEV-USNV--ALB-SG` | `INX-PRD-USNV--ALB-SG` | HTTP/HTTPS from internet |
| ECS Security Group | `INX-DEV-USNV--ECS-SG` | `INX-PRD-USNV--ECS-SG` | App ports from ALB only |
| **LOAD BALANCING** | | | |
| Application Load Balancer | `INX-DEV-USNV-ALB` | `INX-PRD-USNV-ALB` | Internet-facing ALB |
| Target Group | `INX-DEV-USNV-TG` | `INX-PRD-USNV-TG` | Health check target group |
| **CONTAINER INFRASTRUCTURE** | | | |
| ECS Cluster | `INX-DEV-USNV-CLUSTER01` | `INX-PRD-USNV-CLUSTER01` | Fargate cluster |
| CloudWatch Log Group | `/ecs/INX-DEV-USNV-cluster` | `/ecs/INX-PRD-USNV-cluster` | Container logs |
| Auth Service Task Definition | `INX-DEV-USNV-auth-service` | `INX-PRD-USNV-auth-service` | Node.js auth service |
| Client Service Task Definition | `INX-DEV-USNV-client-service` | `INX-PRD-USNV-client-service` | Python client service |
| Invoice Service Task Definition | `INX-DEV-USNV-invoice-service` | `INX-PRD-USNV-invoice-service` | Node.js invoice service |
| Notification Service Task Definition | `INX-DEV-USNV-notification-service` | `INX-PRD-USNV-notification-service` | Node.js notification service |
| Payment Service Task Definition | `INX-DEV-USNV-payment-service` | `INX-PRD-USNV-payment-service` | Python payment service |
| **CONTAINER REGISTRY** | | | |
| ECR Repository | `inx-INX-DEV-USNV--app` | `inx-INX-PRD-USNV--app` | Container images |
| **IAM ROLES & POLICIES** | | | |
| ECS Task Execution Role | `INX-DEV-USNV-ECS_EXECUTION_ROLE` | `INX-PRD-USNV-ECS_EXECUTION_ROLE` | Pull images, write logs |
| ECS Task Role | `INX-DEV-USNV-ECS_TASK_ROLE` | `INX-PRD-USNV-ECS_TASK_ROLE` | App-level permissions |
| Secrets Manager Policy | `INX-DEV-USNV-SecretsManagerPolicy` | `INX-PRD-USNV-SecretsManagerPolicy` | Access secrets |
| S3 Access Policy | `INX-DEV-USNV-S3AccessPolicy` | `INX-PRD-USNV-S3AccessPolicy` | Access S3 buckets |
| **SECRETS MANAGEMENT** | | | |
| MongoDB Credentials Secret | `INX-DEV-USNV-mongodb-credentials` | `INX-PRD-USNV-mongodb-credentials` | External MongoDB URI |
| JWT Secret | `INX-DEV-USNV-jwt-secret` | `INX-PRD-USNV-jwt-secret` | Authentication key |
| API Keys Secret | `INX-DEV-USNV-api-keys` | `INX-PRD-USNV-api-keys` | Stripe, SendGrid keys |
| **STORAGE** | | | |
| Documents S3 Bucket | `INX-DEV-USNV-invoxa-documents-[random]` | `INX-PRD-USNV-invoxa-documents-[random]` | Invoice attachments |
| **BACKEND STATE** | | | |
| Terraform State S3 Bucket | `inx-dev-terraform-state-9015480` | `inx-prd-terraform-state-9015480` | Terraform state |
| DynamoDB Lock Table | `inx-dev-tf-locks` | `inx-prd-tf-locks` | State locking |

## 🌐 **Network Configuration**

| **Environment** | **VPC CIDR** | **Public Subnets** | **Private Subnets** |
|---|---|---|---|
| **DEV** | `10.1.0.0/16` | `10.1.101.0/24`, `10.1.102.0/24`, `10.1.103.0/24` | `10.1.1.0/24`, `10.1.2.0/24`, `10.1.3.0/24` |
| **PROD** | `10.0.0.0/16` | `10.0.101.0/24`, `10.0.102.0/24`, `10.0.103.0/24` | `10.0.1.0/24`, `10.0.2.0/24`, `10.0.3.0/24` |

## 🚀 **Microservices Configuration**

| **Service** | **Language/Framework** | **Port** | **Container Image Tag** |
|---|---|---|---|
| **Auth Service** | Node.js/Express | 8080 | `auth-service-latest` |
| **Client Service** | Python/Flask | 5000 | `client-service-latest` |
| **Invoice Service** | Node.js/Express | 8080 | `invoice-service-latest` |
| **Notification Service** | Node.js/Express | 8080 | `notification-service-latest` |
| **Payment Service** | Python/Flask | 5000 | `payment-service-latest` |

## 📋 **Resource Count Summary**

| **Category** | **DEV Count** | **PROD Count** | **Total** |
|---|---|---|---|
| **VPC Resources** | 13 | 13 | 26 |
| **Security Groups** | 2 | 2 | 4 |
| **Load Balancer** | 2 | 2 | 4 |
| **ECS Resources** | 7 | 7 | 14 |
| **IAM Resources** | 6 | 6 | 12 |
| **Secrets** | 6 | 6 | 12 |
| **Storage** | 3 | 3 | 6 |
| **Total per Environment** | **39** | **39** | **78** |

## 💰 **Estimated Monthly Costs**

| **Environment** | **Estimated Cost** | **Key Components** |
|---|---|---|
| **DEV** | **$116-150/month** | ECS Fargate, ALB, NAT Gateway, S3, Secrets |
| **PROD** | **$200-350/month** | Higher instance sizes, more traffic, enhanced monitoring |

## 🔑 **Key Differences Between Environments**

### **DEV Environment:**
- Smaller resource allocations (256 CPU, 512 MB memory)
- Single NAT Gateway for cost optimization
- Basic monitoring and logging
- Lower traffic expectations

### **PROD Environment:**
- Production-ready resource sizes
- Enhanced security configurations
- Comprehensive monitoring and alerting
- High availability considerations

## 📝 **Notes**

1. **Random Suffix**: S3 bucket names include random suffixes to ensure global uniqueness
2. **No RDS**: Database resources are commented out since you're using external MongoDB
3. **Secrets**: All sensitive data is stored in AWS Secrets Manager
4. **High Availability**: Resources are distributed across 3 availability zones
5. **Security**: All resources follow AWS security best practices with least-privilege access

This infrastructure supports your complete microservices architecture with proper separation between environments! 🚀
