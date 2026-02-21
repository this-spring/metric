#!/usr/bin/env python3
"""Fetch all registered indicators and write JSON data files."""

import importlib
import json
import os
import sys
from datetime import datetime, timezone

from config import INDICATORS

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def load_indicator(class_path: str):
    """Dynamically import and instantiate an indicator class."""
    module_path, class_name = class_path.rsplit(".", 1)
    module = importlib.import_module(module_path)
    cls = getattr(module, class_name)
    return cls()


def main():
    os.makedirs(DATA_DIR, exist_ok=True)

    errors = []
    for class_path in INDICATORS:
        indicator = load_indicator(class_path)
        print(f"Fetching {indicator.display_name} ...")

        try:
            data = indicator.fetch()
        except Exception as e:
            print(f"  ERROR: {e}")
            errors.append(f"{indicator.name}: {e}")
            continue

        output = {
            "name": indicator.name,
            "display_name": indicator.display_name,
            "description": indicator.description,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "data": data,
        }

        path = os.path.join(DATA_DIR, f"{indicator.name}.json")
        with open(path, "w") as f:
            json.dump(output, f, indent=2)

        print(f"  OK — {len(data)} records → {path}")

    if errors:
        print(f"\n{len(errors)} indicator(s) failed:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
