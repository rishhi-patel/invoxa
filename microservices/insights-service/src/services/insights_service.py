from datetime import datetime, timezone
from typing import List, Dict, Any
from ..repositories.clients_repo import count_clients, recent_clients
from ..repositories.invoices_repo import (
    count_invoices, sum_paid_between, sum_pending,
    revenue_by_month, recent_invoice_activity
)
from ..utils.dates import month_bounds, last_n_months


def get_summary_cards() -> Dict[str, Any]:
    """
    Returns the four dashboard cards:
    - totalClients
    - totalInvoices
    - revenueThisMonth
    - pendingPayments
    """
    total_clients = count_clients()
    total_invoices = count_invoices()

    now = datetime.now(timezone.utc)
    start, end = month_bounds(now)
    revenue_this_month = sum_paid_between(start, end)
    pending_payments = sum_pending()

    return {
        "totalClients": total_clients,
        "totalInvoices": total_invoices,
        "revenueThisMonth": round(revenue_this_month, 2),
        "pendingPayments": round(pending_payments, 2)
    }


def get_revenue_trends(months: int = 6):
    """
    Returns [{label: 'Jan', total: 1234.56}, ...] for PAID invoices.
    """
    from calendar import month_abbr
    out = []
    for (start, end) in last_n_months(months):
        total = revenue_by_month(start, end)
        label = f"{month_abbr[start.month]}"
        out.append({"label": label, "total": round(total, 2)})
    return out


def get_recent_activity(limit: int = 10):
    """
    Compose a recent activity feed combining invoice updates and new clients.
    """
    invoices = recent_invoice_activity(
        limit=limit*2)  # grab more then trim later
    activities = []

    for inv in invoices:
        label = None
        if inv.get("status") == "PAID":
            label = f"Invoice {inv.get('number')} marked as paid"
            tag = "payment"
            ts = inv.get("updatedAt") or inv.get("createdAt")
        elif inv.get("status") == "SENT":
            label = f"Invoice {inv.get('number')} sent to {inv.get('clientSnapshot', {}).get('name', 'client')}"
            tag = "invoice"
            ts = inv.get("updatedAt") or inv.get("createdAt")
        else:
            label = f"Invoice {inv.get('number')} updated"
            tag = "invoice"
            ts = inv.get("updatedAt") or inv.get("createdAt")

        activities.append({
            "type": "invoice",
            "label": label,
            "tag": tag,
            "amount": inv.get("total"),
            "timestamp": ts
        })

    # (Optional) you can also mix in new clients if you want the feed more diverse:
    # clients = recent_clients(limit=limit)
    # for c in clients:
    #     activities.append({
    #         "type": "client",
    #         "label": f"New client added: {c.get('name')}",
    #         "tag": "client",
    #         "timestamp": c.get("createdAt")
    #     })

    # sort combined by timestamp desc and trim
    activities.sort(key=lambda x: x.get("timestamp")
                    or datetime.min, reverse=True)
    return activities[:limit]
