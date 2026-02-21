import yfinance as yf

from .base import BaseIndicator


class NasdaqPE(BaseIndicator):
    name = "nasdaq_pe"
    display_name = "NASDAQ Composite PE Ratio"
    description = "NASDAQ Composite index price-to-earnings ratio estimated from QQQ ETF"

    def fetch(self) -> list[dict]:
        # Use QQQ (Nasdaq-100 ETF) as proxy since direct NASDAQ PE is hard to get
        ticker = yf.Ticker("QQQ")
        hist = ticker.history(period="max", interval="1mo")

        if hist.empty:
            raise ValueError("No data returned for QQQ")

        # Get trailing PE from earnings data
        # For historical approximation, use price / earnings ratio from info
        info = ticker.info
        current_pe = info.get("trailingPE")

        if current_pe is None:
            raise ValueError("Could not get PE ratio for QQQ")

        # Build historical PE by scaling price history relative to current
        current_price = hist["Close"].iloc[-1]
        pe_ratio = current_pe / current_price

        data = []
        for date, row in hist.iterrows():
            estimated_pe = row["Close"] * pe_ratio
            data.append({
                "date": date.strftime("%Y-%m-%d"),
                "value": round(estimated_pe, 2),
            })

        return data
