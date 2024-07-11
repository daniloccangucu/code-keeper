#### General Setup
Set up a source control system for the microservices source code
  - [x] Inventory-app
  - [x] Billing-app
  - [ ] Gateway-api
- [x] Set up source control for infrastructure configuration

#### Infrastructure Setup with Terraform
- [x] Create Terraform scripts for infrastructure setup
  - [x] Initialize Terraform working directory and backend
  - [x] Validate Terraform configuration files
  - [x] Plan Terraform execution plan
  - [x] Apply Terraform configuration to staging environment
  - [x] Manual approval step for production deployment
  - [x] Apply Terraform configuration to production environment

#### GitLab and Runners Deployment
- [x] Create an Ansible playbook to deploy and configure a GitLab instance
- [x] Deploy the GitLab instance on a cloud platform or local environment using Ansible
- [x] Configure the GitLab instance to support CI/CD pipelines
- [x] Set up GitLab Runners and integrate them with the existing pipeline

### Microservice Implementation

#### Inventory Application
- [x] Set up Inventory IaC in Terraform
- [x] Set up Inventory Application repository
- [x] Design and implement CI pipeline for Inventory Application
  - [x] Build: Compile and package the application
  - [x] Test: Run unit and integration tests
  - [x] Scan: Analyze source code and dependencies for security vulnerabilities
  - [x] Containerization: Package application into Docker image and push to a container registry
- [x] Design and implement CD pipeline for Inventory Application
  - [x] Deploy to Staging: Deploy application to staging environment
  - [x] Approval: Manual approval for production deployment
  - [x] Deploy to Production: Deploy application to production environment
- [ ] Validate the pipeline functionality for Inventory Application

#### Billing Application
- [ ] Set up Billing Application repository
- [ ] Design and implement CI pipeline for Billing Application
  - [ ] Build: Compile and package the application
  - [ ] Test: Run unit and integration tests
  - [ ] Scan: Analyze source code and dependencies for security vulnerabilities
  - [ ] Containerization: Package application into Docker image and push to a container registry
- [ ] Design and implement CD pipeline for Billing Application
  - [ ] Deploy to Staging: Deploy application to staging environment
  - [ ] Approval: Manual approval for production deployment
  - [ ] Deploy to Production: Deploy application to production environment
- [ ] Validate the pipeline functionality for Billing Application

#### API Gateway Application
- [ ] Set up API Gateway Application repository
- [ ] Design and implement CI pipeline for API Gateway Application
  - [ ] Build: Compile and package the application
  - [ ] Test: Run unit and integration tests
  - [ ] Scan: Analyze source code and dependencies for security vulnerabilities
  - [ ] Containerization: Package application into Docker image and push to a container registry
- [ ] Design and implement CD pipeline for API Gateway Application
  - [ ] Deploy to Staging: Deploy application to staging environment
  - [ ] Approval: Manual approval for production deployment
  - [ ] Deploy to Production: Deploy application to production environment
- [ ] Validate the pipeline functionality for API Gateway Application

#### Cybersecurity Measures
- [ ] Restrict triggers to protected branches
- [ ] Separate credentials from code
- [ ] Apply the least privilege principle
- [ ] Update dependencies and tools regularly

#### Documentation
- [ ] Write a README.md file with full documentation (prerequisites, configuration, setup, usage)

### Role Play Preparation
- [ ] Prepare for a role play question session to present and explain your solution

### Submission and Audit
- [ ] Submit CI/CD pipeline configuration files, scripts, and other required artifacts
- [ ] Submit the Ansible playbook and scripts for deploying and configuring GitLab
- [ ] Ensure the solution is running and correctly configured for the audit session