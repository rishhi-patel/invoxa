# Jenkins CI/CD Pipeline Documentation

## 🚀 **Overview**

This setup provides two separate, environment-specific Jenkins pipelines for the Invoxa application:

- **`Jenkinsfile-dev`**: For development deployments (cicd branch)
- **`Jenkinsfile-prod`**: For production deployments (release branch)

## 📁 **File Structure**

```
invoxa/
├── Jenkinsfile-dev          # Development pipeline
├── Jenkinsfile-prod         # Production pipeline
├── terraform/               # Infrastructure as Code
│   ├── dev.tfvars          # Development variables
│   ├── prod.tfvars         # Production variables
│   └── modules/            # Terraform modules
└── microservices/          # Application services
    ├── auth-service/
    ├── client-service/
    ├── invoice-service/
    ├── notification-service/
    └── payment-service/
```

## 🌟 **Key Features**

### **Smart Change Detection**
- ✅ Detects infrastructure changes automatically
- ✅ Shows detailed plan of what will change
- ✅ Professional "no changes" messaging
- ✅ Only deploys when changes are detected

### **Complete CI/CD Pipeline**
- 🏗️ **Infrastructure**: Terraform plan/apply
- 🐳 **Containers**: Build and push to ECR
- 🚀 **Deployment**: Deploy to ECS Fargate
- 🔍 **Verification**: Health checks and validation

### **Environment Separation**
- 🔒 **DEV**: Runs on `cicd` branch, relaxed approvals
- 🔒 **PROD**: Runs on `release` branch, strict approvals

## 🔧 **Pipeline Parameters**

### **Common Parameters**
| Parameter | Type | Description |
|---|---|---|
| `ACTION` | Choice | `plan`, `apply`, `destroy` |
| `AUTO_APPROVE` | Boolean | Skip manual approval (use carefully) |
| `DEPLOY_CONTAINERS` | Boolean | Build and deploy containers |
| `DEPLOYMENT_TICKET` | String | Deployment ticket number |

### **Production-Only Parameters**
| Parameter | Type | Description |
|---|---|---|
| `APPROVED_BY` | String | **REQUIRED** - Name of approver |

## 🏗️ **Infrastructure Pipeline Stages**

### **1. Environment Validation**
```bash
✅ Validates correct branch (cicd/release)
✅ Checks required parameters
✅ Sets environment variables
```

### **2. AWS Authentication**
```bash
🔐 Assumes appropriate IAM role
🔐 Sets temporary credentials
🔐 Validates permissions
```

### **3. Infrastructure Analysis**
```bash
📋 terraform init (with remote state)
📋 terraform validate
📋 terraform plan -detailed-exitcode
📊 Determines if changes exist
```

### **4. Change Detection Logic**
```bash
Exit Code 0: No changes
    └── "✅ No infrastructure changes detected"
    
Exit Code 2: Changes detected
    └── "📊 Infrastructure changes detected"
    └── Shows detailed plan
    └── Proceeds with deployment
    
Exit Code 1: Error
    └── "❌ Terraform plan failed"
```

### **5. Infrastructure Deployment**
```bash
🏗️ terraform apply (if changes detected)
✅ Stores outputs for next stages
📝 Archives deployment artifacts
```

### **6. Container Build & Push**
```bash
🐳 Parallel builds for all 5 microservices:
    ├── auth-service (Node.js)
    ├── client-service (Python)
    ├── invoice-service (Node.js)
    ├── notification-service (Node.js)
    └── payment-service (Python)

📦 Tags: service-{BUILD_NUMBER}-{GIT_COMMIT}
🚀 Push to ECR with multiple tags
```

### **7. ECS Service Deployment**
```bash
🚀 Deploy to ECS Fargate
🔍 Health verification
📊 Service status monitoring
```

## 🔒 **Security & Approvals**

### **Development Environment**
- ✅ Runs on `cicd` branch
- ✅ Minimal approval requirements
- ✅ Auto-approve option available
- ✅ Fast iteration cycles

### **Production Environment**
- 🔒 **MUST** run on `release` branch only
- 🔒 **REQUIRES** deployment ticket
- 🔒 **REQUIRES** approver name
- 🔒 Multiple confirmation prompts
- 🔒 30-minute timeout for reviews
- 🔒 Enhanced logging and audit trail

## 📊 **Output Examples**

### **No Changes Detected**
```
✅ DEPLOYMENT STATUS: NO CHANGES REQUIRED

📊 Infrastructure State: Up to date
🏗️ Resources: All resources match desired configuration
📅 Last Updated: Current state is already aligned with Terraform configuration

💡 Summary: No infrastructure changes were detected. Your DEV environment is running the latest configuration.
```

### **Changes Deployed**
```
✅ DEPLOYMENT STATUS: SUCCESSFULLY COMPLETED

🏗️ Infrastructure: Updated with latest changes
🐳 Containers: Built and pushed to ECR
🚀 Services: Deployed to ECS Fargate
📅 Deployment Time: 2025-08-03 14:30:00
🎫 Ticket: INVOXA-2025-001

💡 Summary: All components have been successfully deployed to the DEV environment.
🌐 Application URL: http://invoxa-dev-alb-123456789.us-east-1.elb.amazonaws.com
```

## 🚀 **Usage Instructions**

### **Setting Up Jenkins Jobs**

#### **1. Create DEV Pipeline**
```groovy
// In Jenkins: New Item → Pipeline
Name: invoxa-dev-pipeline
Pipeline script from SCM:
- Repository: your-repo-url
- Branch: cicd
- Script Path: Jenkinsfile-dev
```

#### **2. Create PROD Pipeline**
```groovy
// In Jenkins: New Item → Pipeline
Name: invoxa-prod-pipeline
Pipeline script from SCM:
- Repository: your-repo-url
- Branch: release
- Script Path: Jenkinsfile-prod
```

### **3. Required Jenkins Credentials**
```bash
# AWS Credentials
ID: aws-jenkins-credentials
Type: AWS Credentials
Description: AWS access for Jenkins pipelines
```

### **4. Required IAM Roles**
```bash
# Development Role
arn:aws:iam::857736875915:role/RINX_DEVAWS_JENKINS_ADM

# Production Role  
arn:aws:iam::857736875915:role/RINX_PRDAWS_JENKINS_ADM
```

## 🔧 **Environment Variables**

### **Development (Auto-configured)**
```bash
ENVIRONMENT=dev
TF_VAR_prefix=INX-DEV-USNV-
ECR_REPOSITORY=inx-INX-DEV-USNV--app
ECS_CLUSTER=INX-DEV-USNV-CLUSTER01
TF_STATE_BUCKET=inx-dev-terraform-state-9015480
```

### **Production (Auto-configured)**
```bash
ENVIRONMENT=prod
TF_VAR_prefix=INX-PRD-USNV-
ECR_REPOSITORY=inx-INX-PRD-USNV--app
ECS_CLUSTER=INX-PRD-USNV-CLUSTER01
TF_STATE_BUCKET=inx-prd-terraform-state-9015480
```

## 🐳 **Container Image Strategy**

### **Development Tags**
```bash
auth-service-{BUILD_NUMBER}-{GIT_COMMIT}
auth-service-latest
```

### **Production Tags**
```bash
auth-service-prod-{BUILD_NUMBER}-{GIT_COMMIT}
auth-service-latest
auth-service-stable
```

## 📋 **Prerequisites**

### **Jenkins Plugins Required**
- Pipeline
- AWS Steps
- Docker Pipeline
- Parameterized Trigger
- Build Timeout

### **AWS Resources Required**
- S3 buckets for Terraform state
- DynamoDB tables for state locking
- ECR repositories
- IAM roles with appropriate permissions

### **Repository Structure**
- Terraform code in `/terraform` directory
- Microservices in `/microservices/{service-name}/`
- Each service must have a `Dockerfile`

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Branch Validation Errors**
   ```bash
   Error: DEV pipeline should only run on 'cicd' branch
   Solution: Ensure you're triggering from correct branch
   ```

2. **Missing Parameters (Production)**
   ```bash
   Error: DEPLOYMENT_TICKET is mandatory
   Solution: Fill in all required production parameters
   ```

3. **Terraform State Lock**
   ```bash
   Error: Error locking state
   Solution: Check DynamoDB table exists and is accessible
   ```

4. **ECR Push Failures**
   ```bash
   Error: denied: authentication required
   Solution: Verify ECR repositories exist and IAM permissions
   ```

## 📈 **Best Practices**

### **Development Workflow**
1. Work on feature branches
2. Merge to `cicd` branch
3. Jenkins auto-triggers DEV pipeline
4. Test and validate in DEV environment

### **Production Workflow**
1. Merge `cicd` to `release` branch
2. Fill deployment ticket and approver
3. Manual trigger of PROD pipeline
4. Review changes carefully
5. Approve deployment

### **Monitoring**
- Monitor Jenkins build logs
- Check AWS CloudWatch for application logs
- Verify ECS service health
- Monitor ALB access logs

This setup provides a robust, production-ready CI/CD pipeline with proper change detection, security controls, and comprehensive deployment capabilities! 🚀
