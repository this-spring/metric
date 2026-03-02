import yfinance as yf

from .base import BaseIndicator


class SSEComposite(BaseIndicator):
    name = "sse_composite"
    display_name = "SSE Composite (上证指数)"
    description = "Shanghai Stock Exchange Composite Index"

    def fetch(self) -> list[dict]:
        ticker = yf.Ticker("000001.SS")
        hist = ticker.history(period="max", interval="1mo")

        if hist.empty:
            raise ValueError("No data returned for 000001.SS")

        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": round(row["Close"], 2),
            })

        return data
