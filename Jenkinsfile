node {
  stage('SCM') {
    checkout scm
  }
    stage ('Build-01') {
      sh 'npm install --force'
      }
    stage ('Build-02') {
      sh 'CI=false npm run build'
      }
      stage('aws connect'){
     sh 'aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 684258736905.dkr.ecr.us-west-1.amazonaws.com'
   }  
    stage('Build Docker Image'){
     sh 'docker build -t paycircle_business .'
   }
   stage('Tag Docker Image'){
     sh 'docker tag paycircle_business:latest 684258736905.dkr.ecr.us-west-1.amazonaws.com/paycircle_business:latest'
   }
   stage('Push Docker Image'){
     sh 'docker push 684258736905.dkr.ecr.us-west-1.amazonaws.com/paycircle_business:latest'
   }
   stage('Update Docker Image'){
     sh 'aws ecs update-service --cluster  Diam-Docker --service PayCircle_Business --force-new-deployment --region us-west-1'
   }
   stage('Email Notification'){
     emailext attachLog: true, body: '', subject: 'Crypto exchange project', to: 'pclweb@diamanteblockchain.com'
   }
}