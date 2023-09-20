pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('docker_hub')
    BRANCH = "${env.BRANCH_NAME}"
    COMMIT = "${env.GIT_COMMIT}"
  }

  stages {

    // 
    stage("Build Agent") {
      when {
        branch "dev"
      }
      agent {
        dockerfile true
      }
      steps {
        echo "Agent built successfully!"
      }
    }

    // **DEV ONLY** - Uses ESLint to check for errors
    stage("Linting") {
      when {
        branch "dev"
      }
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

    // **DEV ONLY** - Runs unit tests with Jest
    stage("Testing") {
      when {
        branch "dev"
      }
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

    // **DEV ONLY** - Builds code
    stage("Building") {
      when{
          branch "dev"
      }
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

    // **MAIN ONLY** - Validate push to Docker Hub
    stage('Validate push') {
      when {
        beforeInput true
        branch "main"
      }
      input {
        message "Push to Docker Hub?"
        ok "Push!!"
      }
      steps{
        echo 'Push Accepted'
      }
    }

    // **MAIN ONLY** - Sign in to Docker Hub
    stage('Login to Docker Hub') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }

    // **MAIN ONLY** - Pushes the production image to Docker hub 
    stage("Push to Docker Hub") {
      when {
        branch "main"
      }
      steps {
        script {
          sh "docker tag next-app-main rymela/next-project"
          sh "docker push rymela/next-project"
        }
      }
    }

    // **MAIN ONLY** - Update ECS Service
    stage("Depoly") {
      when {
        branch "main"
      }
      steps {
        withCredentials()
      }
    }

    // **MAIN ONLY** - Removes image
    stage("Remove repo image") {
      when {
        branch "main"
      }
      steps {
        script {
          sh "docker rmi rymela/next-project"
        }
      }
    }

  }

  post {

    failure {
      steps {
      script {
        slackSend(color: "#FF0000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline failed: ${ERROR_MESSAGE} \nPlease fix!!") 
      }
      when {
        branch "dev"
      }
      script {
        sh "docker stop next-app-dev"
      }
      }
    }

    success {
      script {
        slackSend(color: "#008000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline succeeded!  \nGood job!!!")
      }
    }
  }
}