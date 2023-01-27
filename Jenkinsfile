pipeline {
    agent { docker { image 'node:12' } }
      stages {
        stage('log version info') {
      steps {
        // sh 'mvn --version'
        sh 'sudo docker build -t express_test'
        sh 'sudo docker run --name express_test -p 4001:4001 -d express_test'
      }
    }
  }
}