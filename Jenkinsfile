def catchErrorAndSetErrorMessage(message, closure) {
    try {
        closure()
    } catch (Exception e) {
        ERROR_MESSAGE = message + ": ${e.getMessage()}"
        currentBuild.result = 'FAILURE'
        error("${ERROR_MESSAGE}")
    }
}

pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('docker_hub')
    BRANCH = "${env.BRANCH_NAME}"
    COMMIT = "${env.GIT_COMMIT}"
  }
  
  stages {

    // *** DEV BRANCH ***
    stage("***DEV BRANCH***") {
      when {
        beforeAgent true
        branch "dev"
      }
      agent {
        dockerfile {
          filename "Dockerfile.dev"
        }
      }
      stages {

        //  Install Dependecies
        stage("Install Dependencies") {
          steps {
            script {
              catchErrorAndSetErrorMessage("There was a problem installing dependencies", {
                sh "npm install"
              })
            }
          }
        }

        stage("Linting") {
          steps {
            script {
              catchErrorAndSetErrorMessage("There was a linting error", {
                sh "npm run lint"
              })
            }
          }
        }

        // Runs unit tests with Jest
        stage("Testing") {
          steps {
            script {
              catchErrorAndSetErrorMessage("Testing failed", {
                sh "npm run test"
              })
            }
          }
        }

        // Builds code
        stage("Building") {
          steps {
            script {
              catchErrorAndSetErrorMessage("Building failed", {
                sh 'npm run build'
              })
            }
          }
        }
      }
    }

    // MAIN BRANCH 
    stage("***MAIN BRANCH***") {
       when {
        branch "main"
      }
      stages {
        stage("Building image") {
          steps {
            script {
              catchErrorAndSetErrorMessage("There was a build error", {
                sh 'docker build --no-cache -t rymela/next-project -f ./Dockerfile.main .'
              })
            }
          }
        }
        //  Validate push to Docker Hub
        stage('Validate push') {
          input {
            message "Push to Docker Hub?"
            ok "Push!!"
          }
          steps{
            echo 'Push Accepted'
          }
        }

        //  Sign in to Docker Hub
        stage('Login to Docker Hub') {
          steps {
            script {
              catchErrorAndSetErrorMessage("Docker Hub login failed", {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
              })
            }
          }
        }

        // Pushes the production image to Docker hub 
        stage("Push to Docker Hub") {
          steps {
            script {
              catchErrorAndSetErrorMessage("Pushing to Docker Hub failed", {
                sh "docker push rymela/next-project"
              })
            }
            
          }
        }

        //  Validate push to Deploy
        stage('Validate deploy') {
          input {
            message "Deploy to ECS?"
            ok "Deploy!!"
          }
          steps{
            echo 'Deployed'
          }
        }

        //  Update ECS Service
        stage("Depoly") {
          steps {
            catchErrorAndSetErrorMessage("Deployment failed!", {
              withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: 'aws-access-next',
                accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                secretKeyVariable: 'AWS_SECRET_ACCESS_KEY',
              ]]) {
                sh 'aws ecs update-service --cluster next-project --service next-project --region eu-north-1 --force-new-deployment'
              }
            })
          }
        }

        //  Removes image
        stage("Remove repo image") {
          steps {
            sh "docker rmi rymela/next-project"
          }
        }
      }
    }
  }

  post {

    failure {
      slackSend(color: "#FF0000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline failed: ${ERROR_MESSAGE} \nPlease fix!!") 
    }

    success {
      slackSend(color: "#008000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline succeeded!  \nGood job!!!")
    }
  }
}