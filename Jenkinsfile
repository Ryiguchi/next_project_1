pipeline {
  agent any
  stages {
    
    stage("Build image") {
      // agent {
      //   dockerfile true
      // }
      steps {
        sh "docker ps"
      }
    }
    stage("Install") {
      steps{
          script {
            sh "echo 'nothing special'"
          }
      }
    }
    
  
  }
}