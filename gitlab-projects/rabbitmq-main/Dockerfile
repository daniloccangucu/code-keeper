# Use the official RabbitMQ image from Docker Hub
FROM rabbitmq:3-management

ARG PGUSER
ARG PGPASSWORD

# Set environment variables for default user and password
ENV RABBITMQ_DEFAULT_USER=${PGUSER}
ENV RABBITMQ_DEFAULT_PASS=${PGPASSWORD}

# Expose RabbitMQ ports
EXPOSE 5672 15672