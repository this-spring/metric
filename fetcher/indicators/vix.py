import yfinance as yf

from .base import BaseIndicator


class VIX(BaseIndicator):
    name = "vix"
    display_name = "VIX (Volatility Index)"
    description = "CBOE Volatility Index - market fear gauge"

    def fetch(self) -> list[dict]:
        ticker = yf.Ticker("^VIX")
        hist = ticker.history(period="max", interval="1mo")

        if hist.empty:
            raise ValueError("No data returned for ^VIX")

        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": round(row["Close"], 2),
            })

        return data
