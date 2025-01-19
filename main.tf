# Specify the Docker provider
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Define the Docker image using your GitHub repository
resource "docker_image" "talentforge_image" {
  name = "talentforge:latest"
  build {
    context = "https://github.com/kashsuks/TalentForge.git"
  }
}

# Define a Docker container using the built image
resource "docker_container" "talentforge_container" {
  name  = "talentforge"
  image = docker_image.talentforge_image.latest

  # Expose the container on a specific port (adjust if necessary)
  ports {
    internal = 80   # The container's internal port
    external = 8080 # The host's external port
  }

  # Optional: Volume mounts (if your app requires them)
  # mounts {
  #   target = "/app/data"
  #   source = "/host/data"
  #   type   = "bind"
  # }

  # Optional: Environment variables
  # env = [
  #   "ENV_VAR_NAME=value",
  #   "ANOTHER_ENV_VAR=another_value"
  # ]
}
