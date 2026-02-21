from abc import ABC, abstractmethod


class BaseIndicator(ABC):
    name: str = ""
    display_name: str = ""
    description: str = ""

    @abstractmethod
    def fetch(self) -> list[dict]:
        """Return data as [{"date": "2024-01-01", "value": 25.3}, ...]"""
        raise NotImplementedError
