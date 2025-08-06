# 🐳 ECR Repositories Analysis for INVOXA

## 📦 **ECR Repository Structure**

Based on your Terraform configuration and Jenkins pipeline setup, here's what ECR repositories will be created:

### **🏗️ Terraform ECR Configuration:**

**Module Location:** `terraform/modules/ecr/main.tf`
**Repository Name Pattern:** `inx-{PREFIX}-app`

### **📋 ECR Repositories to be Created:**

#### **Development Environment:**
```
Repository Name: inx-INX-DEV-USNV--app
Full ECR URI: 857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-DEV-USNV--app
Region: us-east-1
```

#### **Production Environment:**
```
Repository Name: inx-INX-PRD-USNV--app
Full ECR URI: 857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-PRD-USNV--app
Region: us-east-1
```

## 🎯 **Repository Strategy: Single Shared Repository**

### **Important Note:**
You are using a **SINGLE ECR repository** for ALL microservices, not separate repositories per service.

### **Image Tagging Strategy:**
```
Base Repository: inx-INX-DEV-USNV--app

Service Images:
├── auth-service-{BUILD_NUMBER}-{GIT_COMMIT}
├── client-service-{BUILD_NUMBER}-{GIT_COMMIT}  
├── invoice-service-{BUILD_NUMBER}-{GIT_COMMIT}
├── notification-service-{BUILD_NUMBER}-{GIT_COMMIT}
└── payment-service-{BUILD_NUMBER}-{GIT_COMMIT}

Latest Tags:
├── auth-service-latest
├── client-service-latest
├── invoice-service-latest
├── notification-service-latest
└── payment-service-latest
```

### **Example Image Names:**
```bash
# Development Environment
857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-DEV-USNV--app:auth-service-123-a1b2c3d
857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-DEV-USNV--app:client-service-123-a1b2c3d
857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-DEV-USNV--app:invoice-service-123-a1b2c3d
857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-DEV-USNV--app:notification-service-123-a1b2c3d
857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-DEV-USNV--app:payment-service-123-a1b2c3d

# Production Environment (with prod- prefix)
857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-PRD-USNV--app:auth-service-prod-456-b2c3d4e
857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-PRD-USNV--app:client-service-prod-456-b2c3d4e
```

## 🔧 **ECR Repository Configuration:**

### **Repository Features:**
```yaml
Image Tag Mutability: MUTABLE
Image Scanning: Enabled (scan on push)
Lifecycle Policy: Configured
Encryption: Default AWS managed encryption
```

### **Lifecycle Policy:**
```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images older than 14 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed", 
        "countUnit": "days",
        "countNumber": 14
      }
    },
    {
      "rulePriority": 2,
      "description": "Keep only 10 most recent tagged images",
      "selection": {
        "tagStatus": "tagged",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      }
    }
  ]
}
```

## 📊 **Repository Summary:**

| Environment | Repository Name | Region | Account | Total Repositories |
|-------------|-----------------|--------|---------|-------------------|
| Development | `inx-INX-DEV-USNV--app` | us-east-1 | 857736875915 | **1** |
| Production  | `inx-INX-PRD-USNV--app` | us-east-1 | 857736875915 | **1** |
| **TOTAL**   | | | | **2** |

## 🎯 **Microservices Deployment Pattern:**

### **5 Microservices → 2 ECR Repositories:**
```
┌─────────────────────────────────────────────────────────────┐
│                    ECR REPOSITORY STRATEGY                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DEV REPO: inx-INX-DEV-USNV--app                          │
│  ├── auth-service:latest                                   │
│  ├── client-service:latest                                 │
│  ├── invoice-service:latest                                │
│  ├── notification-service:latest                           │
│  └── payment-service:latest                                │
│                                                             │
│  PROD REPO: inx-INX-PRD-USNV--app                         │
│  ├── auth-service-prod:stable                              │
│  ├── client-service-prod:stable                            │
│  ├── invoice-service-prod:stable                           │
│  ├── notification-service-prod:stable                      │
│  └── payment-service-prod:stable                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 **Jenkins Pipeline ECR Integration:**

### **Image Build Process:**
```groovy
// Development
def imageTag = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
def fullImageName = "857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-DEV-USNV--app:${serviceName}-${imageTag}"

// Production  
def prodTag = "prod-${imageTag}"
def fullImageName = "857736875915.dkr.ecr.us-east-1.amazonaws.com/inx-INX-PRD-USNV--app:${serviceName}-${prodTag}"
```

### **Tag Strategy:**
```bash
# Development Tags
{service}-{build}-{commit}     # Specific version
{service}-latest               # Latest version

# Production Tags  
{service}-prod-{build}-{commit} # Specific production version
{service}-latest               # Latest version
{service}-stable               # Stable/approved version
```

## 🚀 **Repository Creation Process:**

### **When Repositories are Created:**
1. **Terraform Apply**: Creates ECR repositories
2. **Jenkins Pipeline**: Pushes first images
3. **ECS Deployment**: References images for container deployment

### **Manual Creation (if needed):**
```bash
# Development
aws ecr create-repository \
    --repository-name "inx-INX-DEV-USNV--app" \
    --region us-east-1

# Production
aws ecr create-repository \
    --repository-name "inx-INX-PRD-USNV--app" \
    --region us-east-1
```

## 💡 **Key Benefits of This Strategy:**

### **✅ Advantages:**
- **Cost Effective**: Only 2 repositories instead of 10
- **Simplified Management**: Single repository per environment
- **Easy Tagging**: Service names as prefixes for organization
- **Lifecycle Management**: Shared cleanup policies

### **⚠️ Considerations:**
- **Shared Lifecycle**: All services share the same retention policy
- **Permissions**: All services use the same repository permissions
- **Naming**: Service names must be part of image tags

## 🎯 **Final Answer:**

**You will have exactly 2 ECR repositories created:**

1. **`inx-INX-DEV-USNV--app`** (Development)
2. **`inx-INX-PRD-USNV--app`** (Production)

Each repository will contain images for all 5 microservices (auth, client, invoice, notification, payment) differentiated by image tags with service names as prefixes.
