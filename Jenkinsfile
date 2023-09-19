pipeline {
  agent any

  environment {
    BRANCH = "${env.BRANCH_NAME}"
    COMMIT = "${env.GIT_COMMIT}"
    NAME = "${env.CHANGE_AUTHOR_DISPLAY_NAME}"
  }

  stages {

    stage("Prune containers") {
      steps {
        sh "docker container prune -f"
      }
    }

    stage("Build image") {
      steps {
        script {
          try {
            sh "docker build --no-cache -t next-app -f ./Dockerfile.dev ."
          } catch (Exception e) {
              ERROR_MESSAGE = "There was a build error: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    stage("Run Image") {
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
        slackSend(color: "#FF0000", message: "NAME: ${NAME} \nBRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \nMESSAGE: Pipeline failed: ${ERROR_MESSAGE} \nPlease fix!!") 
      }
    }
    success {
      script {
        slackSend(color: "#008000", message: "NAME: ${NAME} \nBRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \nMESSAGE: Pipeline succeeded!  \nGood job!!!")
      }
    }
  }
}