pipeline {
  agent any
  stages {
    
    stage("Check node version") {
   
      steps {
        script {
                    // Build the Docker image using your Dockerfile
                    def customImage = docker.build("next-project", "-f . .")
                    customImage.inside {
                        // You can run tests or other commands inside the Docker container here
                        sh "node -v"
                        // Add additional test commands as needed
                    }
      }
    }
    stage("Install") {
      steps{
          script {
            sh "nothing"
          }
      }
    }
  
  }
}