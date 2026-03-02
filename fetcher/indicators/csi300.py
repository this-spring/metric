import yfinance as yf

from .base import BaseIndicator


class CSI300(BaseIndicator):
    name = "csi300"
    display_name = "CSI 300 (沪深300)"
    description = "CSI 300 Index - top 300 stocks on Shanghai and Shenzhen exchanges"

    def fetch(self) -> list[dict]:
        ticker = yf.Ticker("000300.SS")
        hist = ticker.history(period="max", interval="1mo")

        if hist.empty:
            raise ValueError("No data returned for 000300.SS")

        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": round(row["Close"], 2),
            })

        return data
