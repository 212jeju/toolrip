"""Rich-based logging utilities for agent orchestration."""

from __future__ import annotations

import time
from typing import Any

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

console = Console()

# Mapping of agent names to colors for visual distinction
AGENT_COLORS: dict[str, str] = {
    "orchestrator": "bold magenta",
    "pm": "bold cyan",
    "designer": "bold green",
    "frontend": "bold yellow",
    "backend": "bold blue",
    "qa": "bold red",
}


def _agent_style(agent_name: str) -> str:
    """Return the Rich style string for a given agent."""
    return AGENT_COLORS.get(agent_name.lower(), "bold white")


def log_agent_start(agent_name: str, service_name: str) -> float:
    """Log that an agent has started working on a service.

    Returns the start timestamp for duration tracking.
    """
    style = _agent_style(agent_name)
    console.print()
    console.print(
        Panel(
            f"[{style}]{agent_name.upper()}[/{style}] agent started "
            f"working on [bold]{service_name}[/bold]",
            border_style=style,
            title="Agent Started",
            title_align="left",
        )
    )
    return time.time()


def log_agent_complete(
    agent_name: str, service_name: str, duration: float
) -> None:
    """Log that an agent has completed its work."""
    style = _agent_style(agent_name)
    elapsed = time.time() - duration
    minutes, seconds = divmod(int(elapsed), 60)
    time_str = f"{minutes}m {seconds}s" if minutes else f"{seconds}s"
    console.print(
        Panel(
            f"[{style}]{agent_name.upper()}[/{style}] completed work on "
            f"[bold]{service_name}[/bold] in {time_str}",
            border_style="green",
            title="Agent Complete",
            title_align="left",
        )
    )


def log_error(message: str, *, agent_name: str | None = None) -> None:
    """Log an error message with optional agent context."""
    prefix = ""
    if agent_name:
        style = _agent_style(agent_name)
        prefix = f"[{style}]{agent_name.upper()}[/{style}] "
    console.print(f"  [bold red]ERROR[/bold red] {prefix}{message}")


def log_step(
    step_number: int, total_steps: int, description: str
) -> None:
    """Log a numbered workflow step."""
    console.print(
        f"  [dim][{step_number}/{total_steps}][/dim] {description}"
    )


def log_iteration(
    iteration: int, max_iterations: int, reason: str
) -> None:
    """Log a QA retry iteration."""
    console.print(
        f"  [bold yellow]RETRY[/bold yellow] "
        f"Iteration {iteration}/{max_iterations}: {reason}"
    )


def log_info(message: str) -> None:
    """Log a general informational message."""
    console.print(f"  [dim]INFO[/dim] {message}")


def log_success(message: str) -> None:
    """Log a success message."""
    console.print(f"  [bold green]OK[/bold green] {message}")


def log_warning(message: str) -> None:
    """Log a warning message."""
    console.print(f"  [bold yellow]WARN[/bold yellow] {message}")


def print_services_table(services: list[dict[str, Any]]) -> None:
    """Print a formatted table of services."""
    table = Table(title="Services")
    table.add_column("Name", style="bold cyan")
    table.add_column("Status", style="bold")
    table.add_column("Description")
    table.add_column("URL")

    for svc in services:
        status = svc.get("status", "unknown")
        status_style = {
            "deployed": "[green]deployed[/green]",
            "created": "[yellow]created[/yellow]",
            "failed": "[red]failed[/red]",
        }.get(status, status)
        table.add_row(
            svc.get("name", ""),
            status_style,
            svc.get("description", ""),
            svc.get("url", ""),
        )

    console.print(table)


def print_summary(
    service_name: str, status: str, duration: float, issues: list[str] | None = None
) -> None:
    """Print a final summary panel for a service creation run."""
    elapsed = time.time() - duration
    minutes, seconds = divmod(int(elapsed), 60)
    time_str = f"{minutes}m {seconds}s" if minutes else f"{seconds}s"

    body = Text()
    body.append(f"Service: {service_name}\n", style="bold")
    body.append(f"Status: {status}\n")
    body.append(f"Duration: {time_str}\n")

    if issues:
        body.append("\nIssues:\n", style="bold red")
        for issue in issues:
            body.append(f"  - {issue}\n")

    border = "green" if status == "PASS" else "red"
    console.print(Panel(body, title="Run Summary", border_style=border))
