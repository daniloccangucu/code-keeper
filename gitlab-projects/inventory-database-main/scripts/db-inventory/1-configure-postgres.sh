#!/bin/bash
set -e

# Create the SQL file with the password change command in /tmp directory
echo "ALTER USER postgres WITH PASSWORD '$PGPASSWORD';" > /tmp/change_password.sql

# Run the SQL file as the postgres user
psql -U postgres -f /tmp/change_password.sql

# Clean up by removing the SQL file
rm /tmp/change_password.sql
