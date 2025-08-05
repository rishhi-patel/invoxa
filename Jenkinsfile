pipeline {
    agent any

    environment {
        AWS_REGION      = 'us-east-1'                      // Change as needed
        AWS_ACCOUNT_ID  = credentials('aws-account-id')    // Store in Jenkins credentials
        AWS_ACCESS_KEY  = credentials('aws-access-key-id')
        AWS_SECRET_KEY  = credentials('aws-secret-access-key')
        TF_DIR          = 'terraform'
        TF_ENV_FILE     = 'terraform/envs/prod.tfvars'
    }

    options {
        timestamps()
        ansiColor('xterm')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'git@github.com:your-org/invoxa.git'
            }
        }

        stage('Terraform Init') {
            steps {
                sh '''
                    cd $TF_DIR
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY

                    terraform init -reconfigure \
                        -backend-config="region=$AWS_REGION"
                '''
            }
        }

        stage('Terraform Plan & Conditional Apply') {
            steps {
                sh '''
                    cd $TF_DIR
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY

                    terraform plan -var-file=$TF_ENV_FILE -out=tfplan

                    # Check if there are any "create" or "update" actions
                    if terraform show -json tfplan | jq '.resource_changes[]? | select(.change.actions | inside(["create","update"]))' | grep -q .; then
                        echo "Infrastructure changes detected. Applying..."
                        terraform apply -auto-approve tfplan
                    else
                        echo "No infrastructure changes detected. Skipping apply..."
                    fi
                '''
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                sh '''
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY

                    aws ecr get-login-password --region $AWS_REGION \
                      | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

                    for service in microservices/*-service; do
                        IMAGE_NAME=$(basename $service)
                        echo "Building Docker image for $IMAGE_NAME..."
                        docker build -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest $service
                        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest
                    done
                '''
            }
        }

        stage('Update ECS Services') {
            steps {
                sh '''
                    CLUSTER=$(terraform -chdir=$TF_DIR output -raw cluster_id)

                    for service in auth-service client-service invoice-service notification-service payment-service; do
                        echo "Updating ECS service $service..."
                        aws ecs update-service \
                          --cluster $CLUSTER \
                          --service $service \
                          --force-new-deployment \
                          --region $AWS_REGION
                    done
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
        }
        failure {
            echo "❌ Deployment failed. Check logs."
        }
        always {
            sh 'docker system prune -af || true'
        }
    }
}
