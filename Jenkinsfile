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

    // stage("Remove image if present") {
    //   steps{
    //       catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
    //         sh "docker rm next-app-dev"
    //       }
    //   }
    // }

    stage("Run Image") {
      steps{
            sh "docker run --rm  -p 4000:3000 --name next-app-dev next-app"
      }
    }

    stage("Get logs") {
      steps {
        script {
          def logs = sh(
            script: "docker logs next-app-dev",
            returnStdout: true
          )
          echo "Container Logs:"
          echo logs  // Display logs in Jenkins console
          // writeFile(file: "container-logs.txt", text: logs)  // Save logs to a file
        }
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