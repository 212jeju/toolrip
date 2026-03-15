"""Workflow for creating a single web service end-to-end.

Orchestrates the full pipeline: PM -> Designer -> Scaffold -> Backend -> Frontend -> QA
with quality gates and iteration loops.
"""

from __future__ import annotations

import asyncio
import json
import re
import time
from pathlib import Path

from agents.definitions import get_agents
from agents.utils.artifacts import ensure_artifact_dir, get_qa_report_path
from agents.utils.config import Config
from agents.utils.logger import (
    log_agent_complete,
    log_agent_start,
    log_error,
    log_info,
    log_iteration,
    log_step,
    log_success,
    log_warning,
    print_summary,
)


def _validate_service_name(name: str) -> str:
    """Validate that the service name is kebab-case.

    Returns the validated name or raises ValueError.
    """
    if not re.match(r"^[a-z][a-z0-9]*(-[a-z0-9]+)*$", name):
        raise ValueError(
            f"Service name '{name}' is not valid kebab-case. "
            "Use lowercase letters, numbers, and hyphens (e.g., 'word-counter')."
        )
    return name


def _update_services_json(
    project_root: str,
    service_name: str,
    description: str,
    status: str,
    url: str = "",
) -> None:
    """Update the services.json registry at the project root."""
    services_path = Path(project_root) / "services.json"

    if services_path.exists():
        with open(services_path, "r", encoding="utf-8") as f:
            services = json.load(f)
    else:
        services = {"services": []}

    # Update existing entry or add new one
    existing = next(
        (s for s in services["services"] if s["name"] == service_name), None
    )
    entry = {
        "name": service_name,
        "description": description,
        "status": status,
        "url": url,
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }

    if existing:
        services["services"] = [
            entry if s["name"] == service_name else s
            for s in services["services"]
        ]
    else:
        services["services"].append(entry)

    with open(services_path, "w", encoding="utf-8") as f:
        json.dump(services, f, indent=2, ensure_ascii=False)
        f.write("\n")


async def create_service_workflow(
    service_name: str,
    description: str,
    config: Config | None = None,
) -> None:
    """Run the full service creation pipeline.

    Parameters
    ----------
    service_name:
        Kebab-case name for the new service (e.g., "word-counter").
    description:
        High-level description of what the service does.
    config:
        Optional configuration. Loaded from environment if not provided.
    """
    if config is None:
        config = Config.load()

    # --- Validation -----------------------------------------------------------
    service_name = _validate_service_name(service_name)
    if not config.validate_api_key():
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not set. "
            "Copy .env.example to .env and add your key."
        )

    log_info(f"Starting service creation pipeline for '{service_name}'")
    log_info(f"Description: {description}")
    log_info(f"Project root: {config.project_root}")
    log_info(f"Models: orchestrator={config.orchestrator_model}, agents={config.agent_model}")
    run_start = time.time()

    # --- Setup ----------------------------------------------------------------
    ensure_artifact_dir(config.project_root, service_name)

    agents = get_agents(
        orchestrator_model=config.orchestrator_model,
        agent_model=config.agent_model,
        max_iterations=config.max_iterations,
        max_budget=config.max_budget_per_service,
    )

    orchestrator = agents["orchestrator"]
    orchestrator_prompt = orchestrator.build_prompt(service_name, description)

    # --- Attempt to import and run via Claude Agent SDK -----------------------
    # The SDK provides the `query` function that dispatches to sub-agents.
    # If the SDK is not installed, we fall back to a placeholder that logs
    # instructions for manual execution.

    try:
        from claude_agent_sdk import query  # type: ignore[import-untyped]

        log_step(1, 6, "Invoking orchestrator via Claude Agent SDK ...")
        start = log_agent_start("orchestrator", service_name)

        # Build the sub-agent definitions for the SDK
        sub_agents = {
            name: {
                "description": defn.description,
                "prompt": defn.build_prompt(service_name, description),
                "tools": defn.tools,
                "model": defn.model,
                "max_tokens": defn.max_tokens,
            }
            for name, defn in agents.items()
            if name != "orchestrator"
        }

        result = await query(
            prompt=orchestrator_prompt,
            tools=orchestrator.tools,
            model=orchestrator.model,
            max_tokens=orchestrator.max_tokens,
            agents=sub_agents,
        )

        log_agent_complete("orchestrator", service_name, start)

        # --- Check QA result --------------------------------------------------
        qa_report_path = get_qa_report_path(config.project_root, service_name)
        if qa_report_path.exists():
            report_text = qa_report_path.read_text(encoding="utf-8")
            if "## Verdict: PASS" in report_text:
                status = "PASS"
                log_success(f"Service '{service_name}' passed QA.")
            else:
                status = "FAIL"
                log_warning(f"Service '{service_name}' did not pass QA.")
        else:
            status = "created"
            log_warning("QA report not found -- marking as created.")

        _update_services_json(
            config.project_root, service_name, description, status
        )
        print_summary(service_name, status, run_start)

    except ImportError:
        log_warning(
            "claude_agent_sdk is not installed. "
            "Running in dry-run mode -- printing pipeline plan."
        )
        _print_dry_run(agents, service_name, description, config)
        _update_services_json(
            config.project_root, service_name, description, "planned"
        )
        print_summary(service_name, "DRY-RUN", run_start)


def _print_dry_run(
    agents: dict,
    service_name: str,
    description: str,
    config: Config,
) -> None:
    """Print the pipeline plan without executing it."""
    from rich.console import Console
    from rich.panel import Panel

    console = Console()

    steps = [
        ("pm", "Generate product specification"),
        ("designer", "Create design specification"),
        ("frontend", "Scaffold and implement frontend"),
        ("backend", "Implement backend API (if needed)"),
        ("qa", "Run quality assurance"),
    ]

    console.print()
    console.print(
        Panel(
            f"[bold]Service:[/bold] {service_name}\n"
            f"[bold]Description:[/bold] {description}\n"
            f"[bold]Max iterations:[/bold] {config.max_iterations}\n"
            f"[bold]Budget:[/bold] ${config.max_budget_per_service:.2f}",
            title="Dry Run -- Pipeline Plan",
            border_style="yellow",
        )
    )

    for i, (agent_name, step_desc) in enumerate(steps, 1):
        agent = agents[agent_name]
        log_step(i, len(steps), f"{step_desc}")
        console.print(f"    Agent: [bold]{agent.name}[/bold]")
        console.print(f"    Model: {agent.model}")
        console.print(f"    Tools: {', '.join(agent.tools)}")
        console.print()

    console.print(
        "[dim]Install claude-agent-sdk and set ANTHROPIC_API_KEY to run "
        "the pipeline for real.[/dim]"
    )
