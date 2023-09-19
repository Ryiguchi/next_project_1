pipeline {
  agent any
  // stages {
  //   stage ("test") {
  //     steps {
  //     sh "ss -tunlp"
  //     }
  //   }
  // }

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

  //   stage("Remove image if it exists") {
  //     steps {
  //       catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
  //         sh "docker rm next-app-dev"
  //       }
  //     }
  //   }

    stage("Run Image") {
      steps{
            sh "docker run -d --rm  -p 4000:3000 --name next-app-dev next-app"
      }
    }

    stage("Print Logs") {
      
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