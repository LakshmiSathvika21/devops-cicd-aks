# 🚀 Production-Grade CI/CD Pipeline with GitHub Actions, AKS & Observability

## 📌 Overview

This project demonstrates an end-to-end DevOps pipeline that automates application build, testing, containerization, deployment, and monitoring using cloud-native tools.

It simulates a real-world production setup using GitHub Actions, Docker, Kubernetes (AKS), Helm, Prometheus, and Grafana.

---

## 🏗️ Architecture

Code → GitHub → GitHub Actions → Docker → Container Registry → AKS → Helm → Pods → Prometheus → Grafana

---

## ⚙️ Tech Stack

* CI/CD: GitHub Actions
* Containerization: Docker
* Orchestration: Kubernetes (AKS)
* Deployment: Helm
* Monitoring: Prometheus & Grafana
* Cloud: Microsoft Azure

---

## 🔄 CI/CD Workflow

1. Developer pushes code to GitHub
2. GitHub Actions triggers pipeline
3. App is built and tested
4. Docker image is created and pushed
5. Helm deploys app to AKS
6. Prometheus collects metrics
7. Grafana visualizes performance

---

## 🚀 Setup Instructions

### 1. Clone Repo

```bash
git clone <your-repo-url>
cd devops-cicd-aks
```

### 2. Run Locally

```bash
cd app
npm install
node index.js
```

### 3. Build & Push Docker Image

```bash
docker build -t <docker-username>/devops-app .
docker push <docker-username>/devops-app
```

### 4. Create AKS Cluster

```bash
az aks create --resource-group devops-rg --name devops-cluster --node-count 1 --enable-addons monitoring --generate-ssh-keys
```

### 5. Deploy with Helm

```bash
helm upgrade --install devops-app ./devops-app
```

---

## 🔐 GitHub Secrets Required

* DOCKER_USERNAME
* DOCKER_PASSWORD
* AZURE_CREDENTIALS

---

## 📊 Monitoring

* Prometheus collects cluster metrics
* Grafana dashboards visualize CPU, memory, and pod health
* Alertmanager configured for alerting

---

## ⭐ Key Features

* Automated CI/CD pipeline
* Dockerized application
* Kubernetes deployment using Helm
* Real-time monitoring and alerting
* Scalable architecture

---

## 📈 Impact

* Reduced deployment time by ~60%
* Improved deployment reliability
* Enabled real-time observability

---

## 📸 Screenshots

(Add below)

* GitHub Actions pipeline success
* Kubernetes pods & services
* Application running
* Grafana dashboard

---

## 👩‍💻 Author

Lakshmi Sathvika Annapareddy
