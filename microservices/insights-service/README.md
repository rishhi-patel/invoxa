# 📊 Insights Service

A microservice for generating **PDF invoices** and sending **email notifications**. Includes REST APIs for metrics and insights.

## 📌 Features

- Pixel-perfect invoice PDFs (Puppeteer)
- Email sending with attachments (Nodemailer)
- Metrics endpoints for summary, revenue trends, and recent activity
- Modular codebase with repositories, middleware, and services

## 🛠 Tech Stack

- Python (Flask) for API endpoints
- Node.js / Express for PDF and email services
- Puppeteer (PDF generation)
- Nodemailer (email sending)

## 📂 Project Structure

```
insights-service/
├── src/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── db.py
├── tests/
├── app.py
├── Dockerfile
├── requirements.txt
└── README.md
```

## 🚀 Running Locally

### Python API

```bash
cd insights-service
pip install -r requirements.txt
python app.py
```

**Local API URL:** http://localhost:3003

## 📈 API Endpoints

- `GET /summary` — Get summary cards (auth required)
- `GET /revenue-trends?months=6` — Revenue trends for given months
- `GET /recent-activity?limit=10` — Recent activity with limit

## 🧪 Testing

```bash
pytest
```
