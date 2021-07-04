variable "region" {
  default = "asia-south1"
}

variable "region_zone" {
  default = "asia-south1-c"
}

variable "project_name" {
  description = "turn-multiplayer-game"
}

variable "credentials_file_path" {
  description = "Path to the JSON file used to describe your account credentials"
  default     = "google-compute-engine-account.json"
}

variable "public_key_path" {
  description = "Path to file containing public key"
  default     = "~/.ssh/gcloud_id_rsa.pub"
}
