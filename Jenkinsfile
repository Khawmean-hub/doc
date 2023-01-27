pipeline {
    agent none
    stages {
        stage('Back-end') {
            agent {
                docker { image 'node:16.13.1-alpine' }
            }
            steps {
                sh 'sudo docker build -t express_test'
                sh 'sudo docker run --name express_test -p 3000:3000 -d express_test'
            }
        }
    }
}