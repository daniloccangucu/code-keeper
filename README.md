#### General Setup
- [ ] Set up a source control system for the microservices source code
- [ ] Set up source control for infrastructure configuration

#### Infrastructure Setup with Terraform
- [ ] Create Terraform scripts for infrastructure setup
  - [ ] Initialize Terraform working directory and backend
  - [ ] Validate Terraform configuration files
  - [ ] Plan Terraform execution plan
  - [ ] Apply Terraform configuration to staging environment
  - [ ] Manual approval step for production deployment
  - [ ] Apply Terraform configuration to production environment

#### GitLab and Runners Deployment
- [ ] Create an Ansible playbook to deploy and configure a GitLab instance
- [ ] Deploy the GitLab instance on a cloud platform or local environment using Ansible
- [ ] Configure the GitLab instance to support CI/CD pipelines
- [ ] Set up GitLab Runners and integrate them with the existing pipeline

### Microservice Implementation

#### Inventory Application
- [ ] Set up Inventory Application repository
- [ ] Design and implement CI pipeline for Inventory Application
  - [ ] Build: Compile and package the application
  - [ ] Test: Run unit and integration tests
  - [ ] Scan: Analyze source code and dependencies for security vulnerabilities
  - [ ] Containerization: Package application into Docker image and push to a container registry
- [ ] Design and implement CD pipeline for Inventory Application
  - [ ] Deploy to Staging: Deploy application to staging environment
  - [ ] Approval: Manual approval for production deployment
  - [ ] Deploy to Production: Deploy application to production environment
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

### Evaluation Criteria

#### General
- [ ] Ensure all required files are present in the repository
- [ ] Role play as a stakeholder to explain the solution
  - [ ] Explain DevOps concepts and benefits
  - [ ] Discuss DevOps practices and their implementation in the project
  - [ ] Explain the role of automation and CI/CD in DevOps
  - [ ] Discuss the importance of Infrastructure as Code (IaC)
  - [ ] Explain security integration in development and deployment processes
  - [ ] Address challenges faced and their solutions
  - [ ] Discuss resource optimization and cost reduction in cloud environments
  - [ ] Explain the use of GitLab, GitLab Runners, and Ansible
  - [ ] Discuss the CI/CD pipeline design and implementation
  - [ ] Explain the security measures implemented in the pipelines

#### GitLab and Runners Deployment
- [ ] Demonstrate the use of `ansible-playbook --list-tasks` and `systemctl status`
- [ ] Confirm successful deployment and configuration of GitLab using Ansible
- [ ] Verify GitLab Runners integration and pipeline execution

#### Infrastructure Pipeline
- [ ] Confirm deployment of cloud-design and crud-master for staging and production environments using Terraform
- [ ] Verify similarity in design, resources, and services between environments
- [ ] Ensure infrastructure configuration exists in an independent repository with a configured pipeline
- [ ] Confirm correct implementation of "Init", "Validate", "Plan", "Apply to Staging", "Approval", and "Apply to Production" stages

#### CI Pipeline
- [ ] Verify correct implementation of Build, Test, Scan, and Containerization stages for each repository

#### CD Pipeline
- [ ] Verify correct implementation of "Deploy to Staging", "Approval", and "Deploy to Production" stages for each repository

#### Functionality of Pipelines
- [ ] Demonstrate the functionality of pipelines by running tests
- [ ] Confirm pipelines update the application and infrastructure after each modification

#### Cybersecurity Guidelines
- [ ] Verify triggers are restricted to protected branches
- [ ] Confirm separation of credentials from code
- [ ] Assess application of the least privilege principle
- [ ] Check the process for updating dependencies and tools

#### Documentation
- [ ] Ensure README.md contains all necessary information
- [ ] Verify clarity and completeness of the documentation, including diagrams and descriptions