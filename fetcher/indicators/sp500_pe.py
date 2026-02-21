import requests
from bs4 import BeautifulSoup

from .base import BaseIndicator


class SP500PE(BaseIndicator):
    name = "sp500_pe"
    display_name = "S&P 500 PE Ratio (TTM)"
    description = "S&P 500 trailing twelve months price-to-earnings ratio"

    def fetch(self) -> list[dict]:
        url = "https://www.multpl.com/s-p-500-pe-ratio/table/by-month"
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; MetricBot/1.0)"
        }
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        table = soup.find("table", {"id": "datatable"})
        if not table:
            raise ValueError("Could not find data table on multpl.com")

        rows = table.find("tbody").find_all("tr")
        data = []
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 2:
                date_str = cols[0].get_text(strip=True)
                value_str = cols[1].get_text(strip=True).replace(",", "")
                try:
                    value = float(value_str)
                    data.append({"date": date_str, "value": value})
                except ValueError:
                    continue

        # Sort by date ascending
        data.reverse()
        return data
