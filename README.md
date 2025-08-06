# 🚀 **INVOXA - Invoice Management System**

A modern, cloud-native microservices application for comprehensive invoice management with automated notifications and secure payment processing.

## 📋 **Project Overview**

INVOXA is a full-stack invoice management system built with microservices architecture, deployed on AWS using containerized services. The application provides:

- 🔐 **User Authentication & Authorization**
- 👥 **Client Management**
- 📄 **Invoice Creation & Management**
- 💳 **Secure Payment Processing**
- 📧 **Automated Notifications & PDF Generation**

## 🏗️ **Architecture**

### **Microservices Stack:**
- **Auth Service** (Node.js/TypeScript) - JWT authentication & user management
- **Client Service** (Python/Flask) - Customer data management
- **Invoice Service** (Node.js/TypeScript) - Invoice CRUD operations
- **Payment Service** (Python/Flask) - Payment processing integration
- **Notification Service** (Node.js/TypeScript) - Email & PDF generation

### **Frontend:**
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **React Components** with shadcn/ui

### **Infrastructure:**
- **AWS ECS Fargate** - Container orchestration
- **Application Load Balancer** - Traffic routing
- **Public ECR** - Container registry (FREE tier)
- **MongoDB Atlas** - External database
- **AWS Secrets Manager** - Secure credential storage

## 🗂️ **Project Structure**

```
invoxa/
├── microservices/           # Backend microservices
│   ├── auth-service/        # Authentication service (Node.js/TS)
│   ├── client-service/      # Client management (Python/Flask)
│   ├── invoice-service/     # Invoice operations (Node.js/TS)
│   ├── payment-service/     # Payment processing (Python/Flask)
│   └── notification-service/ # Notifications & PDF (Node.js/TS)
├── frontend/                # Next.js frontend application
├── terraform/               # Infrastructure as Code
│   ├── modules/             # Reusable Terraform modules
│   ├── dev.tfvars          # Development environment variables
│   └── prod.tfvars         # Production environment variables
├── Jenkinsfile-dev         # CI/CD pipeline for development
├── Jenkinsfile-prod        # CI/CD pipeline for production
├── docker-compose.yaml     # Local development setup
└── setup-aws.sh           # AWS prerequisites setup script
```

## 🚀 **Quick Start**

### **Prerequisites:**
- Docker & Docker Compose
- Node.js 18+ (for Node.js services)
- Python 3.11+ (for Flask services)
- AWS CLI configured
- Jenkins (for CI/CD)

### **Local Development:**

1. **Clone the repository:**
```bash
git clone https://github.com/rishhi-patel/invoxa.git
cd invoxa
```

2. **Start all services locally:**
```bash
docker-compose up --build
```

3. **Access the application:**
- Frontend: http://localhost:3000
- Auth Service: http://localhost:3001
- Client Service: http://localhost:3002
- Invoice Service: http://localhost:3003
- Payment Service: http://localhost:3004
- Notification Service: http://localhost:3005

## 🛠️ **Development Setup**

### **Individual Service Setup:**

#### **Node.js Services (Auth, Invoice, Notification):**
```bash
cd microservices/auth-service  # or invoice-service, notification-service
npm install
npm run dev
```

#### **Python Services (Client, Payment):**
```bash
cd microservices/client-service  # or payment-service
pip install -r requirements.txt
flask run --host=0.0.0.0 --port=5000
```

#### **Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ☁️ **Cloud Deployment**

### **Prerequisites - Jenkins Environment Setup:**

Before running the CI/CD pipeline, execute the Jenkins setup script **once** to install all required tools:

```bash
# In your Jenkins agent/container, run:
chmod +x jenkins-setup.sh
./jenkins-setup.sh
```

This installs:
- **AWS CLI v2** - AWS service interactions
- **Terraform v1.6.6** - Infrastructure as Code
- **Node.js v18.19.0 & npm** - Node.js service builds
- **Python 3.11 & pip** - Python service builds  
- **Docker CLI** - Container operations

### **AWS Infrastructure:**
- **2 Environments:** Development (DEV) & Production (PROD)
- **Terraform IaC:** Complete infrastructure automation
- **Jenkins CI/CD:** Automated build & deployment pipelines

### **Deployment Process:**

1. **Setup Jenkins Environment (One-time):**
```bash
./jenkins-setup.sh
```

2. **Setup AWS Resources:**
```bash
chmod +x setup-aws.sh
./setup-aws.sh
```

2. **Deploy Infrastructure:**
```bash
# Development
cd terraform
terraform init -backend-config="bucket=inx-dev-terraform-state"
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars

# Production
terraform init -backend-config="bucket=inx-prd-terraform-state" -reconfigure
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

3. **CI/CD Pipeline:**
- **Development:** Push to `cicd` branch triggers dev pipeline
- **Production:** Push to `release` branch triggers prod pipeline

## 🔧 **Configuration**

### **Environment Variables:**
Each service requires specific environment variables for:
- Database connections (MongoDB Atlas)
- AWS services integration
- External APIs (payment gateways, email services)
- JWT secrets and encryption keys

### **AWS Resources Created:**
- **S3 Buckets:** Terraform state storage
- **DynamoDB Tables:** Terraform state locking
- **ECR Repositories:** Container images (Public - FREE)
- **ECS Cluster:** Container orchestration
- **ALB:** Load balancing and routing
- **Security Groups:** Network access control
- **Secrets Manager:** Secure credential storage

## 📊 **Monitoring & Logging**

- **CloudWatch Logs:** Centralized application logging
- **ECS Service Health:** Built-in container health checks
- **ALB Health Checks:** Endpoint availability monitoring

## 🔒 **Security Features**

- **JWT Authentication:** Secure user sessions
- **Non-root Containers:** Enhanced container security
- **AWS Secrets Manager:** Encrypted credential storage
- **VPC Isolation:** Network security boundaries
- **HTTPS/TLS:** Encrypted data transmission

## 🧪 **Testing**

```bash
# Run unit tests for Node.js services
npm test

# Run integration tests
npm run test:integration

# Run Python service tests
python -m pytest
```

## 📦 **Docker Images**

All services are containerized with:
- **Multi-stage builds** for optimized image size
- **Security best practices** (non-root users, minimal base images)
- **Health checks** for reliability
- **Production-ready configurations**

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 **Support & Troubleshooting**

### **Common Issues:**
- **Docker build failures:** Check Dockerfile syntax and base image availability
- **Database connection issues:** Verify MongoDB Atlas connection strings
- **AWS deployment errors:** Ensure proper IAM permissions and resource limits

### **Getting Help:**
- Check container logs: `docker-compose logs [service-name]`
- Review Jenkins build logs for CI/CD issues
- Monitor AWS CloudWatch for infrastructure problems

**📧 Contact:** For technical support, create an issue in this repository.

---

*Built with ❤️ for efficient invoice management*

```bash
docker-compose up --build
```

## Future Enhancements

- Add real authentication (JWT, OAuth)
- Integrate MongoDB for persistence
- Setup GitHub Actions for CI/CD
- Deploy using AWS ECS + Terraform
- Implement email + PDF functionality in notification service

---

Built with ❤️ by **EXOcode Labs**

- **notification-service**: Sends email notifications with attached invoices

## Technologies Used

- Node.js (Express), Python (Flask)
- Docker & Docker Compose
- Puppeteer (planned for PDF generation)
- GitHub Actions (for CI/CD - to be added)
- AWS ECS, ECR, Route 53, ALB, Secrets Manager (to be added)

## Local Development

To run all services locally:

```bash
docker-compose up --build
```

Each service will be available on the following ports:

- auth-service: `http://localhost:3001`
- client-service: `http://localhost:5001`
- invoice-service: `http://localhost:3002`
- payment-service: `http://localhost:5002`
- notification-service: `http://localhost:3003`

## Folder Structure

```
invoxa/
├── microservices/
│   ├── auth-service/
│   ├── client-service/
│   ├── invoice-service/
│   ├── payment-service/
│   └── notification-service/
├── frontend/
├── infra/
├── docker-compose.yaml
└── README.md
```

## Maintainer

This project is developed and maintained by **Rishikumar Patel** under **EXOcode Labs**.

---
