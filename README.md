- **notification-service**: Sends emails and generates PDF invoices

## Project Structure
```
invoxa/
├── microservices/
│   ├── auth-service/
│   ├── client-service/
│   ├── invoice-service/
│   ├── payment-service/
│   └── notification-service/
├── frontend/                # Frontend (UI from v0.dev)
├── infra/                   # Terraform/CDK Infrastructure setup
└── docker-compose.yaml      # Local development composition
```

## Prerequisites
- Docker
- Node.js and npm (for Node-based services)
- Python 3 and pip (for Flask services)

## Running Locally
1. Clone this repo and navigate into the project folder.
2. Build and run services using Docker Compose:
```bash
docker-compose up --build
```

## Future Enhancements
- Add real authentication (JWT, OAuth)
- Integrate MongoDB for persistence
- Setup GitHub Actions for CI/CD
- Deploy using AWS ECS + Terraform
- Implement email + PDF functionality in notification service

---

Built with ❤️ by **EXOcode Labs**

- **notification-service**: Sends email notifications with attached invoices

## Technologies Used
- Node.js (Express), Python (Flask)
- Docker & Docker Compose
- Puppeteer (planned for PDF generation)
- GitHub Actions (for CI/CD - to be added)
- AWS ECS, ECR, Route 53, ALB, Secrets Manager (to be added)

## Local Development

To run all services locally:

```bash
docker-compose up --build
```

Each service will be available on the following ports:
- auth-service: `http://localhost:3001`
- client-service: `http://localhost:5001`
- invoice-service: `http://localhost:3002`
- payment-service: `http://localhost:5002`
- notification-service: `http://localhost:3003`

## Folder Structure

```
invoxa/
├── microservices/
│   ├── auth-service/
│   ├── client-service/
│   ├── invoice-service/
│   ├── payment-service/
│   └── notification-service/
├── frontend/
├── infra/
├── docker-compose.yaml
└── README.md
```

## Maintainer
This project is developed and maintained by **Rishikumar Patel** under **EXOcode Labs**.

---
