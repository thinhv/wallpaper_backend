pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:14.1.0-alpine3.10'
                    args '-p 3000:3000 -u root:root'
                }
            }
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'node:14.1.0-alpine3.10'
                    args '-p 3000:3000 -u root:root'
                }
            }
            steps {
                sh 'chmod +x ./jenkins/scripts/test.sh'
                sh './jenkins/scripts/test.sh'
            }
        }
        stage('Deliver') {
            agent {
                docker {
                    image 'node:14.1.0-alpine3.10'
                    args '-p 8080:3000 -u root:root'
                }
            }
            steps {
                sh 'chmod +x ./jenkins/scripts/deliver.sh'
                sh './jenkins/scripts/deliver.sh'
                input message: 'Finished?'
            }
        }
    }
}
