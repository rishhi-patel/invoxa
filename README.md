# 🚀 INVOXA – Microservices Platform

A modular, scalable, and cloud-ready **invoice-as-a-service** platform.
INVOXA enables **authentication**, **client management**, **invoice generation**, **payments**, and **analytics** with a clean microservices architecture.

Built with ❤️ by **EXOcode Labs**.

---

## 📂 Project Structure

```
invoxa/
├── microservices/
│   ├── auth-service/        # Authentication & JWT handling (Node.js / Express)
│   ├── client-service/      # Client data management (Node.js / Express)
│   ├── invoice-service/     # Invoice creation and management (Node.js / Express)
│   ├── payment-service/     # Payment processing (Python / Flask)
│   └── insights-service/    # Email + PDF invoice generation (Node.js / Puppeteer)
├── frontend/                # Web frontend (Next.js or React-based)
├── infra/                   # Infrastructure-as-Code (Terraform / AWS CDK)
└── docker-compose.yaml      # Local development composition
```

---

## 🛠 Prerequisites

Before running locally, ensure you have:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) & npm (for Node-based services)
- [Python 3](https://www.python.org/) & pip (for Flask services)
- AWS CLI configured (for infrastructure deployment)
- Terraform (if deploying via IaC)

---

## 🚀 Running Locally

Clone the repository:

```bash
git clone https://github.com/rishhi-patel/invoxa.git
cd invoxa
```

Start **all services** with Docker Compose:

```bash
docker-compose up --build
```

---

## 🌐 Service Endpoints (Local Development)

| Service          | Technology      | Port / URL                              |
| ---------------- | --------------- | --------------------------------------- |
| Auth Service     | Node.js/Express | http://localhost:3001                   |
| Client Service   | Node.js/Express | http://localhost:5001                   |
| Invoice Service  | Node.js/Express | http://localhost:3002                   |
| Payment Service  | Python/Flask    | http://localhost:5002                   |
| Insights Service | Node.js/Express | http://localhost:3003                   |
| Frontend         | Next.js/React   | http://localhost:3000 (if separate run) |

---

## ⚙️ Deployment

1. **Infrastructure Setup** (Terraform or AWS CDK) – in `/infra`
2. **CI/CD Pipelines** – via GitHub Actions
3. **AWS ECS/ECR** for container orchestration
4. **Route 53 + ALB + ACM** for domain and HTTPS setup
5. **Secrets Manager** for environment variables

---

## 📌 Planned Features

- ✅ JWT-based authentication
- ✅ Modular microservices
- ✅ MongoDB integration for persistence
- ✅ GitHub Actions-based CI/CD deployment
- ⏳ Analytics dashboard in frontend
- ⏳ AWS S3 for file storage
- ⏳ Email + PDF generation with Puppeteer (Insights Service)

---

## 🧑‍💻 Local Development Workflow

Run **only a specific service**:

```bash
cd microservices/<serviice>
npm install
npm run dev
```

Run **frontend** separately:

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Technologies Used

**Backend**

- Node.js (Express)
- Python (Flask)
- Puppeteer (PDF Generation)
- JWT for Authentication

**Frontend**

- React / Next.js
- Zustandfor state management

**DevOps & Infra**

- Docker & Docker Compose
- Terraform / AWS CDK
- AWS ECS, ECR, Route 53, ALB, Secrets Manager
- GitHub Actions for CI/CD
