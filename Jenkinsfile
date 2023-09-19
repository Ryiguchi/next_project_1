pipeline {
  agent any

  environment {
    BRANCH = "${env.BRANCH_NAME}"
    COMMIT = "${env.GIT_COMMIT}"
    DOCKERFILE = "Dockerfile.${BRANCH}"
  }

  stages {

    stage("Prune containers") {
      when {
        branch "dev"
      }
      steps {
        sh "docker container prune -f"
      }
    }

    stage("Build image") {
      steps {
        script {
          try {
            echo "${DOCKERFILE}"
            sh "docker build --no-cache -t next-app -f ./${DOCKERFILE} ."
          } catch (Exception e) {
              ERROR_MESSAGE = "There was a build error: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    stage("Run Image") {
      when {
        branch "dev"
      }
      steps{
        script {
          try {
            sh "docker run -d --rm  -p 4000:3000 --name next-app-dev next-app"
          } catch (Exception e) {
              ERROR_MESSAGE = "There was an error running the container: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    stage("Lint Code") {
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

  }

  post {
    always {
      catchError(stageResult: 'SUCCESS', buildResult: 'FAILURE') {
      script {
        sh "docker stop next-app-dev"
      }
      }
    }
    failure {
      script {
        slackSend(color: "#FF0000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline failed: ${ERROR_MESSAGE} \nPlease fix!!") 
      }
    }
    success {
      script {
        slackSend(color: "#008000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline succeeded!  \nGood job!!!")
      }
    }
  }
}