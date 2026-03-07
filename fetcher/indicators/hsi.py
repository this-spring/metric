import yfinance as yf

from .base import BaseIndicator


class HSI(BaseIndicator):
    name = "hsi"
    display_name = "Hang Seng Index (恒生指数)"
    description = "Hang Seng Index - benchmark for Hong Kong stock market"

    def fetch(self) -> list[dict]:
        ticker = yf.Ticker("^HSI")
        hist = ticker.history(period="max", interval="1mo")

        if hist.empty:
            raise ValueError("No data returned for ^HSI")

        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": round(row["Close"], 2),
            })

        return data
