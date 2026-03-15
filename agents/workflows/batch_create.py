"""Batch service creation from a YAML definition file.

Example YAML format:

```yaml
services:
  - name: word-counter
    description: "Online word and character counter tool"
  - name: json-formatter
    description: "JSON formatting and validation tool"
  - name: color-picker
    description: "Color picker with palette generation"
```
"""

from __future__ import annotations

import asyncio
import time
from pathlib import Path

import yaml

from agents.utils.config import Config
from agents.utils.logger import (
    log_error,
    log_info,
    log_step,
    log_success,
    log_warning,
    print_services_table,
)
from agents.workflows.create_service import create_service_workflow


async def batch_create(services_file: str, config: Config | None = None) -> None:
    """Create multiple services from a YAML definition file.

    Parameters
    ----------
    services_file:
        Path to a YAML file containing service definitions.
    config:
        Optional configuration. Loaded from environment if not provided.
    """
    if config is None:
        config = Config.load()

    services_path = Path(services_file)
    if not services_path.exists():
        raise FileNotFoundError(f"Services file not found: {services_file}")

    with open(services_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    if not data or "services" not in data:
        raise ValueError(
            f"Invalid services file format. Expected a 'services' key with a list. "
            f"Got: {list(data.keys()) if data else 'empty file'}"
        )

    services = data["services"]
    if not isinstance(services, list) or len(services) == 0:
        raise ValueError("No services defined in the YAML file.")

    log_info(f"Batch creating {len(services)} services from {services_file}")

    results: list[dict[str, str]] = []
    total = len(services)
    batch_start = time.time()

    for i, svc in enumerate(services, 1):
        name = svc.get("name")
        description = svc.get("description", "")

        if not name:
            log_error(f"Service at index {i} is missing a 'name' field. Skipping.")
            results.append({"name": "???", "status": "skipped", "description": "Missing name"})
            continue

        log_step(i, total, f"Creating service: {name}")

        try:
            await create_service_workflow(name, description, config=config)
            results.append({
                "name": name,
                "status": "created",
                "description": description,
                "url": "",
            })
            log_success(f"Service '{name}' pipeline completed.")
        except Exception as exc:
            log_error(f"Failed to create service '{name}': {exc}")
            results.append({
                "name": name,
                "status": "failed",
                "description": str(exc),
                "url": "",
            })

    # --- Summary --------------------------------------------------------------
    elapsed = time.time() - batch_start
    minutes, seconds = divmod(int(elapsed), 60)
    time_str = f"{minutes}m {seconds}s" if minutes else f"{seconds}s"

    log_info(f"Batch creation completed in {time_str}")
    succeeded = sum(1 for r in results if r["status"] == "created")
    failed = sum(1 for r in results if r["status"] == "failed")
    skipped = sum(1 for r in results if r["status"] == "skipped")
    log_info(f"Results: {succeeded} created, {failed} failed, {skipped} skipped")

    print_services_table(results)
