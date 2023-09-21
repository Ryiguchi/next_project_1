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

        //  Uses ESLint to check for errors
        stage("Install Dependencies") {
          steps {
            script {
              try {
                sh "npm install"
              } catch (Exception e) {
                  ERROR_MESSAGE = "There was a linting error: ${e.getMessage()}"
                  currentBuild.result = 'FAILURE'
                  error("${ERROR_MESSAGE}")
              }
            }
            
          }
        }

        stage("Linting") {
          steps {
            script {
              try {
                sh "npm run lint"
              } catch (Exception e) {
                  ERROR_MESSAGE = "There was a linting error: ${e.getMessage()}"
                  currentBuild.result = 'FAILURE'
                  error("${ERROR_MESSAGE}")
              }
            }
            
          }
        }

        // Runs unit tests with Jest
        stage("Testing") {
          steps {
            script {
              try {
                sh 'npm run test '
              } catch (Exception e) {
                  ERROR_MESSAGE = "Testing failed: ${e.getMessage()}"
                  currentBuild.result = 'FAILURE'
                  error("${ERROR_MESSAGE}")
              }
            }
            
          }
        }

        // Builds code
        stage("Building") {
          steps {
            script {
              try {
                sh 'npm run build'
              } catch (Exception e) {
                  ERROR_MESSAGE = "Building failed: ${e.getMessage()}"
                  currentBuild.result = 'FAILURE'
                  error("${ERROR_MESSAGE}")
              }
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
              try {
                sh "docker build --no-cache -t rymela/next-project -f ./Dockerfile.main ."
              } catch (Exception e) {
                  ERROR_MESSAGE = "There was a build error: ${e.getMessage()}"
                  currentBuild.result = 'FAILURE'
                  error("${ERROR_MESSAGE}")
              }
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
            sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
          }
        }

        // Pushes the production image to Docker hub 
        stage("Push to Docker Hub") {
          steps {
            sh "docker tag next-app-main rymela/next-project"
            sh "docker push rymela/next-project"
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
            withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: 'aws-access-next',
                accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                secretKeyVariable: 'AWS_SECRET_ACCESS_KEY',
            ]]) {
              sh 'aws ecs update-service --cluster next-project-cluster --service next-project --force-new-deployment'
            }
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
      steps {
        slackSend(color: "#FF0000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline failed: ${ERROR_MESSAGE} \nPlease fix!!") 
      }
    }

    success {
      slackSend(color: "#008000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline succeeded!  \nGood job!!!")
    }
  }
}