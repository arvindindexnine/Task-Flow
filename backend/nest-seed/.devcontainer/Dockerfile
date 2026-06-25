FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

RUN npm install -g eslint typescript @nestjs/cli

# Set the working directory and change ownership
WORKDIR /workspace
RUN chown -R node:node /workspace

# Switch to the new user
USER node
