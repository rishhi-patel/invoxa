from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta


def month_bounds(dt: datetime):
    start = dt.replace(day=1, hour=0, minute=0, second=0,
                       microsecond=0, tzinfo=timezone.utc)
    end = (start + relativedelta(months=1))
    return start, end


def last_n_months(n: int):
    now = datetime.now(timezone.utc)
    months = []
    for i in range(n-1, -1, -1):
        anchor = now - relativedelta(months=i)
        start, end = month_bounds(anchor)
        months.append((start, end))
    return months
