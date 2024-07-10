# Ansible Playbook for GitLab Deployment

This playbook is designed to deploy and configure a GitLab instance on a target server.

## Usage

1. Update the `hosts` file with the IP address of your target server.
2. Run the playbook using the following command:
   ```bash
   ansible-playbook -i hosts playbook.yml
