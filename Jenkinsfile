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
        sh "docker build --no-cache -t next-app ."
      }
    }

    stage("Run Image") {
      steps{
            sh "docker run -d --rm  -p 4000:3000 --name next-app-dev next-app"
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
  }
}