pipeline {
  agent any
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
            sh "docker run --rm -d -p 4000:3000 --name next-app-dev next-app"
      }
    }

    stage("Wait for Server") {
            steps {
                script {
                    def retries = 30  // Adjust the number of retries as needed
                    def delaySeconds = 10  // Adjust the delay as needed

                    echo "Waiting for server to start..."
                    def serverReady = false

                    for (int i = 0; i < retries; i++) {
                        def response = sh (
                            script: "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:4000",
                            returnStatus: true
                        )

                        if (response == 0) {
                            serverReady = true
                            break
                        }

                        sleep(delaySeconds)
                    }

                    if (serverReady) {
                        echo "Server is up and running."
                    } else {
                        error "Server did not start within the expected time."
                    }
                }
            }
        }

    stage("Health Check") {
      steps{
        script {
          def response = sh (
                script: """
                    response=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000)

                    if [ "\$response" = "200" ]; then
                        echo "Website is up and running."
                        exit 0  # Success
                    else
                        echo "Website is not responding as expected (HTTP \$response)"
                        exit 1  # Failure
                    fi
                """,
                returnStatus: true
            )
            if (response == 0) {
                echo "Health check passed."
            } else {
                error "Health check failed."
            }
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