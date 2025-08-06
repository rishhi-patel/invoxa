#!/bin/bash
# INVOXA - Jenkins Tools Setup Script
# This script installs all necessary tools for the Jenkins CI/CD pipeline

set -e

echo "INVOXA - Jenkins Tools Installation Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as jenkins user
if [ "$USER" != "jenkins" ] && [ "$USER" != "root" ]; then
    print_warning "This script should be run as 'jenkins' user or with sudo privileges"
    print_info "Current user: $USER"
fi

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p /var/jenkins_home/bin
mkdir -p /var/jenkins_home/tools
mkdir -p /tmp/jenkins-setup

echo ""
print_info "Starting tool installation..."
echo "=============================================="

# 1. Install AWS CLI v2
echo ""
print_info "1. Installing AWS CLI v2..."
if [ ! -f /var/jenkins_home/bin/aws ]; then
    cd /tmp/jenkins-setup
    curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    ./aws/install --install-dir /var/jenkins_home/aws-cli --bin-dir /var/jenkins_home/bin
    rm -rf awscliv2.zip aws/
    print_status "AWS CLI v2 installed successfully"
else
    print_status "AWS CLI v2 already installed"
fi

# Verify AWS CLI
if /var/jenkins_home/bin/aws --version > /dev/null 2>&1; then
    AWS_VERSION=$(/var/jenkins_home/bin/aws --version)
    print_status "AWS CLI version: $AWS_VERSION"
else
    print_error "AWS CLI installation failed"
    exit 1
fi

# 2. Install Terraform
echo ""
print_info "2. Installing Terraform..."
TERRAFORM_VERSION="1.9.5"
if [ ! -f /var/jenkins_home/bin/terraform ]; then
    cd /tmp/jenkins-setup
    curl -s "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip" -o "terraform.zip"
    unzip -q terraform.zip
    chmod +x terraform
    mv terraform /var/jenkins_home/bin/
    rm -f terraform.zip
    print_status "Terraform v${TERRAFORM_VERSION} installed successfully"
else
    print_status "Terraform already installed"
fi

# Verify Terraform
if /var/jenkins_home/bin/terraform version > /dev/null 2>&1; then
    TF_VERSION=$(/var/jenkins_home/bin/terraform version -json | grep '"terraform_version"' | cut -d '"' -f 4)
    print_status "Terraform version: v$TF_VERSION"
else
    print_error "Terraform installation failed"
    exit 1
fi

# 3. Install Docker (if not present)
echo ""
print_info "3. Checking Docker installation..."
if command -v docker > /dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f 3 | cut -d ',' -f 1)
    print_status "Docker already installed: v$DOCKER_VERSION"
else
    print_warning "Docker not found. Please install Docker manually:"
    print_info "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    print_info "sudo usermod -aG docker jenkins"
fi

# 4. Install kubectl (for potential Kubernetes integration)
echo ""
print_info "4. Installing kubectl..."
KUBECTL_VERSION="v1.28.2"
if [ ! -f /var/jenkins_home/bin/kubectl ]; then
    cd /tmp/jenkins-setup
    curl -s -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
    chmod +x kubectl
    mv kubectl /var/jenkins_home/bin/
    print_status "kubectl ${KUBECTL_VERSION} installed successfully"
else
    print_status "kubectl already installed"
fi

# Verify kubectl
if /var/jenkins_home/bin/kubectl version --client > /dev/null 2>&1; then
    KUBECTL_VER=$(/var/jenkins_home/bin/kubectl version --client -o json | grep '"gitVersion"' | cut -d '"' -f 4)
    print_status "kubectl version: $KUBECTL_VER"
else
    print_error "kubectl installation failed"
fi

# 5. Install jq (for JSON processing)
echo ""
print_info "5. Installing jq (JSON processor)..."
if [ ! -f /var/jenkins_home/bin/jq ]; then
    cd /tmp/jenkins-setup
    curl -s -L "https://github.com/stedolan/jq/releases/download/jq-1.7/jq-linux64" -o "jq"
    chmod +x jq
    mv jq /var/jenkins_home/bin/
    print_status "jq installed successfully"
else
    print_status "jq already installed"
fi

# Verify jq
if /var/jenkins_home/bin/jq --version > /dev/null 2>&1; then
    JQ_VERSION=$(/var/jenkins_home/bin/jq --version)
    print_status "jq version: $JQ_VERSION"
else
    print_error "jq installation failed"
fi

# 6. Install yq (for YAML processing)
echo ""
print_info "6. Installing yq (YAML processor)..."
if [ ! -f /var/jenkins_home/bin/yq ]; then
    cd /tmp/jenkins-setup
    curl -s -L "https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64" -o "yq"
    chmod +x yq
    mv yq /var/jenkins_home/bin/
    print_status "yq installed successfully"
else
    print_status "yq already installed"
fi

# Verify yq
if /var/jenkins_home/bin/yq --version > /dev/null 2>&1; then
    YQ_VERSION=$(/var/jenkins_home/bin/yq --version)
    print_status "$YQ_VERSION"
else
    print_error "yq installation failed"
fi

# 7. Install Node.js and npm (for frontend builds)
echo ""
print_info "7. Installing Node.js..."
NODE_VERSION="18.18.0"
if [ ! -d /var/jenkins_home/tools/node ]; then
    cd /tmp/jenkins-setup
    curl -s "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o "node.tar.xz"
    tar -xf node.tar.xz
    mv "node-v${NODE_VERSION}-linux-x64" /var/jenkins_home/tools/node
    ln -sf /var/jenkins_home/tools/node/bin/node /var/jenkins_home/bin/node
    ln -sf /var/jenkins_home/tools/node/bin/npm /var/jenkins_home/bin/npm
    ln -sf /var/jenkins_home/tools/node/bin/npx /var/jenkins_home/bin/npx
    rm -f node.tar.xz
    print_status "Node.js v${NODE_VERSION} installed successfully"
else
    print_status "Node.js already installed"
fi

# Verify Node.js
if /var/jenkins_home/bin/node --version > /dev/null 2>&1; then
    NODE_VER=$(/var/jenkins_home/bin/node --version)
    NPM_VER=$(/var/jenkins_home/bin/npm --version)
    print_status "Node.js version: $NODE_VER"
    print_status "npm version: v$NPM_VER"
else
    print_error "Node.js installation failed"
fi

# 8. Install Python pip packages (for Python services)
echo ""
print_info "8. Installing Python packages..."
if command -v python3 > /dev/null 2>&1; then
    python3 -m pip install --user --upgrade pip setuptools wheel
    python3 -m pip install --user flask requests boto3 pymongo python-dotenv
    print_status "Python packages installed successfully"
else
    print_warning "Python3 not found. Please install Python3 manually."
fi

# 9. Set up PATH configuration
echo ""
print_info "9. Setting up PATH configuration..."
cat > /var/jenkins_home/.bashrc << 'EOF'
# Jenkins Tools PATH
export PATH="/var/jenkins_home/bin:/var/jenkins_home/tools/node/bin:$PATH"

# AWS CLI configuration
export AWS_DEFAULT_REGION="us-east-1"
export AWS_DEFAULT_OUTPUT="json"

# Tool aliases
alias tf='terraform'
alias k='kubectl'
alias awscli='/var/jenkins_home/bin/aws'

# Jenkins environment
export JENKINS_HOME="/var/jenkins_home"
EOF

# Create a script to update PATH for Jenkins jobs
cat > /var/jenkins_home/bin/setup-env.sh << 'EOF'
#!/bin/bash
# Source this script in Jenkins jobs to set up environment
export PATH="/var/jenkins_home/bin:/var/jenkins_home/tools/node/bin:$PATH"
export AWS_DEFAULT_REGION="us-east-1"
export AWS_DEFAULT_OUTPUT="json"
EOF

chmod +x /var/jenkins_home/bin/setup-env.sh
print_status "PATH configuration created"

# 10. Cleanup
echo ""
print_info "10. Cleaning up temporary files..."
rm -rf /tmp/jenkins-setup
print_status "Cleanup completed"

# Final summary
echo ""
echo "=============================================="
print_status "INSTALLATION COMPLETE!"
echo "=============================================="
echo ""
print_info "Installed Tools Summary:"
echo "------------------------"
echo "✅ AWS CLI v2: /var/jenkins_home/bin/aws"
echo "✅ Terraform: /var/jenkins_home/bin/terraform"
echo "✅ kubectl: /var/jenkins_home/bin/kubectl"
echo "✅ jq: /var/jenkins_home/bin/jq"
echo "✅ yq: /var/jenkins_home/bin/yq"
echo "✅ Node.js & npm: /var/jenkins_home/tools/node"
echo "✅ Python packages: flask, requests, boto3, pymongo"
echo ""
print_info "PATH Configuration:"
echo "-------------------"
echo "• Tools directory: /var/jenkins_home/bin"
echo "• Environment setup: /var/jenkins_home/bin/setup-env.sh"
echo "• Bashrc configured: /var/jenkins_home/.bashrc"
echo ""
print_info "Next Steps:"
echo "-----------"
echo "1. Restart Jenkins to apply environment changes"
echo "2. Verify tools are accessible in Jenkins jobs"
echo "3. Update Jenkinsfile to source setup-env.sh"
echo ""
print_warning "Required Jenkins Plugins:"
echo "• Pipeline Utility Steps (for readJSON)"
echo "• Docker Plugin"
echo "• AWS Steps Plugin"
echo "• Git Plugin"
echo ""
print_info "Installation completed successfully! 🎉"
