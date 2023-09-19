pipeline {
  agent any

  environment {
    BRANCH = "${env.BRANCH_NAME}"
    COMMIT = "${env.GIT_COMMIT}"
  }

  stages {

    // **DEV ONLY** - Removes the old container if it exists due to previous error
    stage("Pruning old containers") {
      when {
        branch "dev"
      }
      steps {
        sh "docker container prune -f"
      }
    }

    // Builds Docker image 
    stage("Building image") {
      steps {
        sh 'pwd'
        script {
          
          if (BRANCH == 'main') {
              DOCKERFILE = "Dockerfile.main"
          } else {
              DOCKERFILE = "Dockerfile.dev"
          }

          try {
            sh "docker build --no-cache -t next-app-${BRANCH} -f ./${DOCKERFILE} ."
          } catch (Exception e) {
              ERROR_MESSAGE = "There was a build error: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    // **DEV ONLY** - Starts Docker container
    stage("Startings container") {
      when {
        branch "dev"
      }
      steps{
        script {
          try {
            sh "docker run -d --rm  -p 4000:3000 --name next-app-dev next-app-dev"
          } catch (Exception e) {
              ERROR_MESSAGE = "There was an error running the container: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
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
            sh "docker exec next-app-dev npm run lint"
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
            sh 'docker exec next-app-dev npm run test '
          } catch (Exception e) {
              ERROR_MESSAGE = "Testing failed: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
        
      }
    }

    stage("Building") {
      when{
          branch "dev"
      }
      steps {
        script {
          try {
            sh 'docker exec next-app-dev npm run build'
          } catch (Exception e) {
              ERROR_MESSAGE = "Building failed: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    stage("Remove container") {
      when {
          branch "dev"
      }
      steps {
        script {
          sh "docker stop next-app-dev"
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