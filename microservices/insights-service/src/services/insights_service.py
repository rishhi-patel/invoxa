from datetime import datetime, timezone
from typing import Dict, Any
from ..repositories.clients_repo import count_clients, recent_clients
from ..repositories.invoices_repo import (
    count_invoices, sum_paid_between, sum_pending,
    revenue_by_month, recent_invoice_activity
)
from ..utils.dates import month_bounds, last_n_months
from calendar import month_abbr


def get_summary_cards(user_id: str) -> Dict[str, Any]:
    total_clients = count_clients(user_id)
    total_invoices = count_invoices(user_id)

    now = datetime.now(timezone.utc)
    start, end = month_bounds(now)
    revenue_this_month = sum_paid_between(user_id, start, end)
    pending_payments = sum_pending(user_id)

    return {
        "totalClients": total_clients,
        "totalInvoices": total_invoices,
        "revenueThisMonth": round(revenue_this_month, 2),
        "pendingPayments": round(pending_payments, 2)
    }


def get_revenue_trends(user_id: str, months: int = 6):
    out = []
    for (start, end) in last_n_months(months):
        total = revenue_by_month(user_id, start, end)
        out.append(
            {"label": month_abbr[start.month], "total": round(total, 2)})
    return out


def get_recent_activity(user_id: str, limit: int = 10):
    invoices = recent_invoice_activity(user_id, limit=limit*2)
    activities = []
    for inv in invoices:
        status = inv.get("status")
        if status == "PAID":
            label, tag = f"Invoice {inv.get('number')} marked as paid", "payment"
        elif status == "SENT":
            to_name = inv.get("clientSnapshot", {}).get("name", "client")
            label, tag = f"Invoice {inv.get('number')} sent to {to_name}", "invoice"
        else:
            label, tag = f"Invoice {inv.get('number')} updated", "invoice"

        ts = inv.get("updatedAt") or inv.get("createdAt")
        activities.append({
            "type": "invoice",
            "label": label,
            "tag": tag,
            "amount": inv.get("total"),
            "timestamp": ts
        })

    activities.sort(key=lambda x: x.get("timestamp"), reverse=True)
    return activities[:limit]
