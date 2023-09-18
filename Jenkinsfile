pipeline {
  agent {
    dockerfile true
  }
  stages {}
    
  //   stage("Build image") {
  //     steps {
  //       sh "docker build -t next-app ."
  //     }
  //   }

  //   // stage("Remove image if present") {
  //   //   steps{
  //   //       catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
  //   //         sh "docker rm next-app-dev"
  //   //       }
  //   //   }
  //   // }

  //   stage("Run Image") {
  //     steps{
  //           sh "docker run --rm -d -p 4000:3000 --name next-app-dev next-app"
  //     }
  //   }

  //   stage("Remove Container") {
  //     steps{
  //         sh "docker stop next-app-dev"
  //     }
  //   }
  // }

  // post {
  //   failure {
  //     script {
  //       sh "docker stop next-app-dev"
  //     }
  //     script {
  //       sh "docker rm next-app-dev"
        
  //     }
  //   }
  // }
}