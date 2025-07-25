import groovy.util.Node

// Jenkinsfile for Invoxa project

@copilot can you help me to write a Jenkinsfile to deploy the Terraform code in the invoxa/terraform directory in aws

pipeline {

   agent any

   stages {

       stage('Setup parameters') {

           steps {

               script {

                   String sectionHeaderStyle = '''

                   color: white;

                   background: dimgrey;

                   font-family: Roboto, sans-serif !important;

                   padding: 5px;

                   text-align: center;

                   '''

                   String separatorStyle = '''

                       border: 0;

                       border-bottom: 3px;

                       background: #999;c

                   '''

                   properties([

                       parameters([

                           [

                               $class: 'ParameterSeparatorDefinition',

                               name: 'Tag_HEADER',

                               sectionHeader: 'INVOXA',

                               separatorStyle: separatorStyle,

                               sectionHeaderStyle: sectionHeaderStyle

                           ],

                           choice(

                               choices: ['dev','prd'],

                               name: 'Organization_Environment',

                               description: "Select Organization Environment"

                           ),

                           [

                               $class: 'CascadeChoiceParameter',

                               choiceType: 'PT_SINGLE_SELECT',

                               description: 'Invoxa Account where application will be deployed',

                               filterLength: 1, filterable: false,

                               name: 'InvoxaAccount',

                               randomName: 'choice-parameter-01',

                               referencedParameters: 'Organization_Environment',

                               script:

                               [

                                   $class: 'GroovyScript',

                                   fallbackScript:

                                   [

                                       classpath: [],

                                       sandbox: true,

                                       script: 'return[""]'],

                                   script: [

                                       classpath: [],

                                       sandbox: true,

                                       script: '''

                                           if(Organization_Environment.equals('dev'))

                                           {

                                           return['invoxa-dev']

                                           }

                                           else if(Organization_Environment.equals('prd'))

                                           {

                                           return['invoxa-prd']

                                           }


                                           else

                                           {

                                           return['NA']

                                           }    

                                               '''

                                           ]

                               ]

                           ],

                           [

                               $class: 'CascadeChoiceParameter',

                               choiceType: 'PT_SINGLE_SELECT',

                               description: 'Invoxa Account Number where application will be deployed',

                               filterLength: 1, filterable: false,

                               name: 'InvoxaAccountNo',

                               randomName: 'choice-parameter-02',

                               referencedParameters: 'InvoxaAccount',

                               script: [

                                   $class: 'GroovyScript',

                                   fallbackScript: [

                                       classpath: [],

                                       sandbox: true,

                                       script: 'return[""]'

                                   ],

                                   script: [

                                       classpath: [],

                                       sandbox: true,

                                       script: '''

                                           if(InvoxaAccount.equals('invoxa-dev')) {

                                               return['817998750852']

                                           }

                                           else if(InvoxaAccount.equals('invoxa-prd')) {

                                               return['817998750852']

                                           }

                                           else {

                                               return['NA']

                                           }

                                       '''

                                   ]

                               ]

                           ],

                           [

                               $class: 'CascadeChoiceParameter',

                               choiceType: 'PT_SINGLE_SELECT',

                               description: 'Select Region where IAM Role will be Created',

                               filterLength: 1, filterable: false,

                               name: 'RegionName',

                               randomName: 'choice-parameter-03',

                               referencedParameters: 'InvoxaAccount',

                               script: [

                                   $class: 'GroovyScript',

                                   fallbackScript: [

                                       classpath: [],

                                       sandbox: true,

                                       script: 'return[""]'

                                   ],

                                   script: [

                                       classpath: [],

                                       sandbox: true,

                                       script: '''

                                           if(InvoxaAccount.equals('invoxa-dev') || InvoxaAccount.equals('invoxa-prd')) {

                                               return['us-east-1']

                                           }

                                           else {

                                               return['NA']

                                           }    

                                       '''

                                   ]

                               ]

                           ],

 

                           [

                               $class: 'ParameterSeparatorDefinition',

                               name: 'Tag_HEADER',

                               sectionHeader: 'Tag Details',

                               separatorStyle: separatorStyle,

                               sectionHeaderStyle: sectionHeaderStyle

                           ],

                            string(

                               name: 'ITCHG',

                               defaultValue: '',

                               description: 'Enter Deployment Ticket Number'

                           )

                       ])

                   ])

               }

           }

       }

 

       stage('Assume AWS Role') {

           steps {

               script {

                   // role assume

                   def assumeRole = { roleArn, sessionName ->

                       def assumeRoleOutput = sh(

                           script: """

                               aws sts assume-role --role-arn ${roleArn} --role-session-name ${sessionName} --output json

 

                           """,

                           returnStdout: true

                       ).trim()

 

                       def json = readJSON text: assumeRoleOutput

                       return [

                           accessKey: json.Credentials.AccessKeyId,

                           secretKey: json.Credentials.SecretAccessKey,

                           sessionToken: json.Credentials.SessionToken

                       ]

                   }

 

                   // Assuming IAM Roles based On Organization Environment

                   if (params.InvoxaAccount == 'invoxa-dev') {

                       def role1 = assumeRole("arn:aws:iam::817998750852:role/RINX_DEVAWS_JENKINS_ADM", "jenkins-dev-adm-session")

                       env.AWS_ACCESS_KEY_ID = role1.accessKey

                       env.AWS_SECRET_ACCESS_KEY = role1.secretKey

                       env.AWS_SESSION_TOKEN = role1.sessionToken



                       //CTRGB ASSUME ROLE
                     } else if (params.InvoxaAccount == 'invoxa-prd') {

                       def role1 = assumeRole("arn:aws:iam::817998750852:role/RINX_PRDAWS_JENKINS_ADM", "jenkins-prd-adm-session")

                       env.AWS_ACCESS_KEY_ID = role1.accessKey

                       env.AWS_SECRET_ACCESS_KEY = role1.secretKey

                       env.AWS_SESSION_TOKEN = role1.sessionToken

                   }                 } */else {

                       error "Unsupported Organization Environment: ${params.Organization_Environment}"

                   }

               }

           }

       }

         stage('Terraform Init') {
    
              steps {
    
                script {
    
                     // Initialize Terraform

                     sh 'terraform init'

                     echo 'Terraform initialized successfully.'
    
                }
    
              }
    
         }


         Stage('Terraform Plan') {

              steps {

                  script {
                    if (params.Organization_Environment == 'dev') {
                        sh 'terraform plan -var-file=dev.tfvars -out=tfplan'
                    } else if (params.Organization_Environment == 'prd') {
                        sh 'terraform plan -var-file=prod.tfvars -out=tfplan'
                    } else {
                        error "Unsupported Organization Environment: ${params.Organization_Environment}"
                    }
                    echo "Terraform plan executed successfully for ${params.Organization_Environment} environment."
                  }
                }
            }
            stage('Terraform Apply') {
    
                steps {
    
                    script {
                        if (params.Organization_Environment == 'dev') {
                            sh 'terraform apply -var-file=dev.tfvars tfplan'
                        } else if (params.Organization_Environment == 'prd') {
                            sh 'terraform apply -var-file=prod.tfvars tfplan'
                        } else {
                            error "Unsupported Organization Environment: ${params.Organization_Environment}"
                        }
                        echo "Terraform apply executed successfully for ${params.Organization_Environment} environment."
                    }
                    }
                }
            stage('Cleanup') {
                steps {
                    script {
                        // Clean up Terraform state files
                        sh 'rm -f tfplan'
                        echo 'Terraform state files cleaned up.'
                    }
                }
            }
         stage('Post-Deployment') {
            steps {
                script {
                    // Post-deployment actions, e.g., notifying stakeholders
                    echo "Deployment completed successfully for ${params.Organization_Environment} environment."
                }
            }
        }
    }
    post {
        always {
            script {
                // Clean up AWS credentials
                env.AWS_ACCESS_KEY_ID = ''
                env.AWS_SECRET_ACCESS_KEY = ''
                env.AWS_SESSION_TOKEN = ''
            }
        }
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }

