pipeline {
  agent any

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
              def errorMessage = "Building the image failed: ${e.getMessage()}"
              error(errorMessage)
              slackSend(
                color: "#FF0000",
                message: errorMessage,
              )
          }
        }
      }
    }

    stage("Run Image") {
      steps{
            sh "docker run -d --rm  -p 4000:3000 --name next-app-dev next-app"
      }
    }

    stage("Lint Code") {
      steps {
        script {
          try {
            sh "docker exec next-app-dev npm run lint"
          } catch (Exception e) {
              echo "Linting errors detected"
              def errorMessage = "There were linting errors: ${e.getMessage()}"
              echo "${e.getMessage}"
              error(errorMessage)
              slackSend(
                color: "#FF0000",
                message: errorMessage,
              )
          }
        }
        
      }
    }

    stage("Testing") {
      steps {
        sh 'docker exec next-app-dev npm run test '
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
        slackSend(color: "danger", message: "Please fix the errors!")
      }
    }
    success {
      script {
        slackSend(color: "#008000", message: "Push was successful!  Good Job!")
      }
    }
  }
}