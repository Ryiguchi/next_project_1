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
    stage("Build image") {
      steps {
        sh "docker build -t next-app ."
      }
    }

    stage("Remove image if it exists") {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          sh "docker rm next-app-dev"
        }
      }
    }

    stage("Run Image") {
      steps{
            sh "docker run -d --rm  -p 4000:3000 --name next-app-dev next-app"
      }
    }

    stage("Testing") {
      steps {
        sh 'npm run test'
      }
    }

    stage("Remove Container") {
      steps{
          sh "docker stop next-app-dev"
      }
    }
  }

  post {
    failure {
      script {
        sh "docker stop next-app-dev"
      }
      script {
        sh "docker rm next-app-dev"
        
      }
    }
  }
}