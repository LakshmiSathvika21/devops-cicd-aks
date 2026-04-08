# 🚀 DevOps CI/CD on AKS (Node.js + Helm + GitHub Actions + Prometheus/Grafana)

This repository is a complete starter for shipping a containerized Node.js app to Azure Kubernetes Service (AKS) with automated CI/CD and observability.

## What was improved

- Added proper Node.js tests using the built-in `node:test` runner.
- Refactored the app to support configurable `PORT`, graceful shutdown, and JSON health checks.
- Fixed Helm chart port wiring (service and container now map correctly).
- Added liveness/readiness probes in Helm values.
- Improved Dockerfile layering for faster and more reliable builds (`npm ci`).
- Improved GitHub Actions workflow (npm cache, manual trigger, `helm --wait`).

---

## Repository Structure

```text
.
├── .github/workflows/cicd.yml         # CI/CD pipeline
├── Dockerfile                          # Container build
├── app/
│   ├── index.js                        # Express app
│   ├── index.test.js                   # API tests
│   ├── package.json
│   └── package-lock.json
├── devops-app/
│   ├── Chart.yaml                      # Helm chart
│   ├── values.yaml                     # Helm values
│   └── templates/
│       ├── deployment.yaml
│       └── service.yaml
└── monitoring-values.yaml              # Prometheus/Grafana values
```

---

## Prerequisites

Install these tools locally:

- **Node.js 18+** and npm
- **Docker**
- **kubectl**
- **Helm 3+**
- **Azure CLI** (`az`)
- **Git**

Optional but recommended:
- A Docker Hub account (or Azure Container Registry)
- An Azure subscription with permission to create AKS resources

---

## 1) Run the application locally (every detail)

From repo root:

```bash
cd app
npm ci
npm test
npm start
```

Expected behavior:
- App starts on `http://localhost:3000`
- `GET /` returns: `🚀 CI/CD Pipeline is Working!`
- `GET /health` returns JSON with `status: "ok"`

Quick verification:

```bash
curl -i http://localhost:3000/
curl -i http://localhost:3000/health
```

### Run on a different port

```bash
PORT=8080 npm start
```

---

## 2) Build and run with Docker

From repo root:

```bash
docker build -t <docker-username>/devops-app:latest .
docker run --rm -p 3000:3000 <docker-username>/devops-app:latest
```

Verify:

```bash
curl -i http://localhost:3000/health
```

Push image:

```bash
docker login
docker push <docker-username>/devops-app:latest
```

---

## 3) Create AKS and connect kubectl

```bash
az login
az group create --name devops-rg --location eastus
az aks create \
  --resource-group devops-rg \
  --name devops-cluster \
  --node-count 1 \
  --enable-addons monitoring \
  --generate-ssh-keys
az aks get-credentials --resource-group devops-rg --name devops-cluster
kubectl get nodes
```

---

## 4) Deploy app with Helm

Set image repo/tag in `devops-app/values.yaml` first (or override inline).

Deploy:

```bash
helm upgrade --install devops-app ./devops-app --wait --timeout 5m
kubectl get pods
kubectl get svc
```

Port-forward to test:

```bash
kubectl port-forward svc/devops-app 8080:80
curl -i http://localhost:8080/health
```

---

## 5) Enable monitoring (Prometheus + Grafana)

If you use `kube-prometheus-stack`:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack -f monitoring-values.yaml
```

Check status:

```bash
kubectl get pods -n default
```

Access Grafana (example):

```bash
kubectl port-forward svc/monitoring-grafana 3001:80
```

Then open `http://localhost:3001`.

---

## 6) Configure GitHub Actions CI/CD

Workflow file: `.github/workflows/cicd.yml`

Create these GitHub Secrets in your repo:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `AZURE_CREDENTIALS`

### How to generate `AZURE_CREDENTIALS`

Create a service principal with contributor access to your resource group, then save the JSON output as the secret value:

```bash
az ad sp create-for-rbac \
  --name github-actions-devops-aks \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/devops-rg \
  --sdk-auth
```

After secrets are added:
1. Push to `main` (or run manually using **workflow_dispatch**).
2. `build-test` runs npm install + tests.
3. `docker` builds and pushes image.
4. `deploy` connects to AKS and runs Helm upgrade/install.

---

## 7) Troubleshooting

### App not reachable in cluster

- Confirm pod is running: `kubectl get pods`
- Check pod logs: `kubectl logs deploy/devops-app`
- Check service/endpoints:
  - `kubectl get svc`
  - `kubectl get endpoints`

### Helm deployment timeout

- Inspect events: `kubectl describe pod <pod-name>`
- Verify image exists and is public/private auth is configured.

### GitHub Actions fails on deploy

- Re-check `AZURE_CREDENTIALS` JSON formatting.
- Ensure service principal has access to `devops-rg`.

---

## Key Endpoints

- App: `/`
- Health: `/health`

---

## Author

Lakshmi Sathvika Annapareddy
