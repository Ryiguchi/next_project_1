pipeline {
  agent any

  // environment {
  //   BRANCH = env.BRANCH_NAME
  //   COMMIT = env.GIT_COMMIT
  // }

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
              currentBuild.result = 'FAILURE'
              error("There was a linting error: ${e.getMessage()}")
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
              currentBuild.result = 'FAILURE'
              error("There was a linting error: ${e.getMessage()}")
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
        slackSend(color: "#008000", message: "Pipeline failed: ${currentBuild.currentResult.toString()}")
      }
    }
    success {
      script {
        slackSend(color: "#008000", message: "Pipeline failed: ${currentBuild.currentResult.toString()}")
      }
    }
  }
}