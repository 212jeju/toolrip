"""CLI entry point for the AI multi-agent orchestration system.

Usage:
    python -m agents.main create <name> <description>
    python -m agents.main batch <yaml-file>
    python -m agents.main deploy <name>
    python -m agents.main deploy --all
    python -m agents.main list
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

from agents.utils.config import Config
from agents.utils.logger import (
    log_error,
    log_info,
    log_success,
    print_services_table,
)


def _build_parser() -> argparse.ArgumentParser:
    """Build the argument parser for the CLI."""
    parser = argparse.ArgumentParser(
        prog="agents",
        description="AI Multi-Agent Team for Web Service Development",
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # --- create ---------------------------------------------------------------
    create_parser = subparsers.add_parser(
        "create",
        help="Create a new web service using the agent pipeline",
    )
    create_parser.add_argument(
        "name",
        type=str,
        help="Service name in kebab-case (e.g., 'word-counter')",
    )
    create_parser.add_argument(
        "description",
        type=str,
        help="High-level description of the service",
    )

    # --- batch ----------------------------------------------------------------
    batch_parser = subparsers.add_parser(
        "batch",
        help="Create multiple services from a YAML definition file",
    )
    batch_parser.add_argument(
        "file",
        type=str,
        help="Path to the YAML file with service definitions",
    )

    # --- deploy ---------------------------------------------------------------
    deploy_parser = subparsers.add_parser(
        "deploy",
        help="Deploy a service to Cloudflare",
    )
    deploy_parser.add_argument(
        "name",
        type=str,
        nargs="?",
        default=None,
        help="Service name to deploy (omit with --all to deploy everything)",
    )
    deploy_parser.add_argument(
        "--all",
        action="store_true",
        dest="deploy_all",
        help="Deploy all services that are ready",
    )

    # --- list -----------------------------------------------------------------
    subparsers.add_parser(
        "list",
        help="List all services from services.json",
    )

    return parser


def _cmd_list(config: Config) -> None:
    """Handle the 'list' command."""
    services_path = Path(config.project_root) / "services.json"
    if not services_path.exists():
        log_info("No services.json found. No services have been created yet.")
        return

    with open(services_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    services = data.get("services", [])
    if not services:
        log_info("No services registered.")
        return

    print_services_table(services)


async def _cmd_create(name: str, description: str, config: Config) -> None:
    """Handle the 'create' command."""
    from agents.workflows.create_service import create_service_workflow

    await create_service_workflow(name, description, config=config)


async def _cmd_batch(file: str, config: Config) -> None:
    """Handle the 'batch' command."""
    from agents.workflows.batch_create import batch_create

    await batch_create(file, config=config)


async def _cmd_deploy(name: str | None, deploy_all: bool, config: Config) -> None:
    """Handle the 'deploy' command."""
    from agents.workflows.deploy_service import deploy_all as _deploy_all
    from agents.workflows.deploy_service import deploy_service

    if deploy_all:
        await _deploy_all(config=config)
    elif name:
        await deploy_service(name, config=config)
    else:
        log_error("Provide a service name or use --all to deploy everything.")
        sys.exit(1)


def main() -> None:
    """Main entry point for the CLI."""
    parser = _build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    config = Config.load()

    try:
        if args.command == "list":
            _cmd_list(config)

        elif args.command == "create":
            asyncio.run(_cmd_create(args.name, args.description, config))

        elif args.command == "batch":
            asyncio.run(_cmd_batch(args.file, config))

        elif args.command == "deploy":
            asyncio.run(
                _cmd_deploy(args.name, args.deploy_all, config)
            )

        else:
            parser.print_help()
            sys.exit(1)

    except KeyboardInterrupt:
        log_info("Interrupted by user.")
        sys.exit(130)
    except FileNotFoundError as exc:
        log_error(str(exc))
        sys.exit(1)
    except ValueError as exc:
        log_error(str(exc))
        sys.exit(1)
    except RuntimeError as exc:
        log_error(str(exc))
        sys.exit(1)


if __name__ == "__main__":
    main()
