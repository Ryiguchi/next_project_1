pipeline {
  agent any
  stages {
    
    stage("Build image") {
      agent {
        dockerfile true
      }
      steps {
        sh "node -v"
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