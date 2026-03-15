"""Deployment workflow for pushing services to Cloudflare Pages/Workers.

Handles both frontend (Cloudflare Pages) and backend (Cloudflare Workers) deployment.
"""

from __future__ import annotations

import asyncio
import json
import subprocess
import time
from pathlib import Path

from agents.utils.config import Config
from agents.utils.logger import (
    log_error,
    log_info,
    log_step,
    log_success,
    log_warning,
)


def _run_command(
    cmd: list[str],
    cwd: str | None = None,
    check: bool = True,
) -> subprocess.CompletedProcess[str]:
    """Run a shell command and return the result."""
    log_info(f"Running: {' '.join(cmd)}")
    result = subprocess.run(
        cmd,
        cwd=cwd,
        capture_output=True,
        text=True,
        timeout=300,
    )
    if check and result.returncode != 0:
        log_error(f"Command failed (exit {result.returncode}):")
        log_error(result.stderr or result.stdout)
        raise RuntimeError(f"Command failed: {' '.join(cmd)}")
    return result


def _update_service_url(project_root: str, service_name: str, url: str) -> None:
    """Update the deployed URL in services.json."""
    services_path = Path(project_root) / "services.json"
    if not services_path.exists():
        return

    with open(services_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for svc in data.get("services", []):
        if svc["name"] == service_name:
            svc["url"] = url
            svc["status"] = "deployed"
            svc["deployedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            break

    with open(services_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


async def deploy_service(
    service_name: str,
    config: Config | None = None,
) -> None:
    """Deploy a single service to Cloudflare.

    Steps:
    1. Build the service via Turborepo.
    2. Deploy frontend to Cloudflare Pages.
    3. Deploy backend to Cloudflare Workers (if it exists).

    Parameters
    ----------
    service_name:
        Name of the service to deploy (must match the app directory name).
    config:
        Optional configuration. Loaded from environment if not provided.
    """
    if config is None:
        config = Config.load()

    project_root = config.project_root
    app_dir = Path(project_root) / "apps" / service_name
    api_dir = Path(project_root) / "apps" / f"{service_name}-api"

    if not app_dir.exists():
        raise FileNotFoundError(
            f"App directory not found: {app_dir}. "
            f"Run 'create {service_name}' first."
        )

    total_steps = 2 + (1 if api_dir.exists() else 0)
    step = 0

    # --- Step 1: Build --------------------------------------------------------
    step += 1
    log_step(step, total_steps, f"Building @repo/{service_name} ...")
    _run_command(
        ["pnpm", "turbo", "build", f"--filter=@repo/{service_name}"],
        cwd=project_root,
    )
    log_success("Build completed successfully.")

    # --- Step 2: Deploy frontend to Cloudflare Pages --------------------------
    step += 1
    log_step(step, total_steps, "Deploying frontend to Cloudflare Pages ...")

    # Determine the build output directory
    out_dir = app_dir / "out"
    if not out_dir.exists():
        out_dir = app_dir / ".next"
    if not out_dir.exists():
        out_dir = app_dir / "dist"
    if not out_dir.exists():
        raise FileNotFoundError(
            f"No build output found in {app_dir}. "
            "Expected 'out/', '.next/', or 'dist/'."
        )

    result = _run_command(
        [
            "wrangler", "pages", "deploy",
            str(out_dir),
            f"--project-name={service_name}",
        ],
        cwd=str(app_dir),
        check=False,
    )

    if result.returncode == 0:
        # Try to extract the deployment URL from wrangler output
        url = ""
        for line in result.stdout.splitlines():
            if "https://" in line and ".pages.dev" in line:
                url = line.strip()
                break
        if not url:
            url = f"https://{service_name}.pages.dev"

        log_success(f"Frontend deployed: {url}")
        _update_service_url(project_root, service_name, url)
    else:
        log_error("Frontend deployment failed.")
        log_error(result.stderr or result.stdout)
        log_warning(
            "You may need to run 'wrangler login' first, or check your "
            "Cloudflare account configuration."
        )

    # --- Step 3: Deploy backend to Cloudflare Workers (if exists) -------------
    if api_dir.exists():
        step += 1
        log_step(step, total_steps, "Deploying backend API to Cloudflare Workers ...")

        api_result = _run_command(
            ["wrangler", "deploy"],
            cwd=str(api_dir),
            check=False,
        )

        if api_result.returncode == 0:
            log_success(f"Backend API deployed for {service_name}.")
        else:
            log_error("Backend deployment failed.")
            log_error(api_result.stderr or api_result.stdout)

    log_info(f"Deployment pipeline complete for '{service_name}'.")


async def deploy_all(config: Config | None = None) -> None:
    """Deploy all services listed in services.json.

    Only deploys services with status 'created' or 'PASS'.
    """
    if config is None:
        config = Config.load()

    services_path = Path(config.project_root) / "services.json"
    if not services_path.exists():
        log_error("services.json not found. No services to deploy.")
        return

    with open(services_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    deployable = [
        s for s in data.get("services", [])
        if s.get("status") in ("created", "PASS")
    ]

    if not deployable:
        log_warning("No services are ready for deployment.")
        return

    log_info(f"Deploying {len(deployable)} services ...")

    for i, svc in enumerate(deployable, 1):
        name = svc["name"]
        log_step(i, len(deployable), f"Deploying {name} ...")
        try:
            await deploy_service(name, config=config)
            log_success(f"Service '{name}' deployed.")
        except Exception as exc:
            log_error(f"Failed to deploy '{name}': {exc}")

    log_info("All deployments complete.")
