terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"  # Replace with the latest version available
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"  # Ensure this is the correct path to your Docker socket
}

# Backend Docker image
resource "docker_image" "backend_image" {
  name = "talentforge_backend:latest"
  build {
    context    = "${path.module}/backend"
    dockerfile = "Dockerfile"
  }
}

# Frontend Docker image
resource "docker_image" "frontend_image" {
  name = "talentforge_frontend:latest"
  build {
    context    = "${path.module}/frontend/talent-forger-app"
    dockerfile = "Dockerfile"
  }
}

# Backend Docker container
resource "docker_container" "backend_container" {
  name  = "talentforge_backend"
  image = docker_image.backend_image.name
  ports {
    internal = 5000
    external = 5000
  }
}

# Frontend Docker container
resource "docker_container" "frontend_container" {
  name  = "talentforge_frontend"
  image = docker_image.frontend_image.name
  ports {
    internal = 3000
    external = 3000
  }
}
