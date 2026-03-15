"""Configuration management for the agent system."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel, Field


def _find_project_root() -> str:
    """Walk up from the agents directory to find the monorepo root."""
    current = Path(__file__).resolve().parent.parent.parent
    # Look for common monorepo markers
    for marker in ("pnpm-workspace.yaml", "turbo.json", "package.json"):
        if (current / marker).exists():
            return str(current)
    return str(current)


class Config(BaseModel):
    """Central configuration for the agent orchestrator."""

    project_root: str = Field(default_factory=_find_project_root)
    anthropic_api_key: str = Field(default="")
    max_budget_per_service: float = Field(
        default=5.0,
        description="Maximum dollar budget per service creation run",
    )
    max_iterations: int = Field(
        default=3,
        description="Maximum QA retry iterations before giving up",
    )
    orchestrator_model: str = Field(
        default="opus",
        description="Model for the orchestrator agent",
    )
    agent_model: str = Field(
        default="sonnet",
        description="Model for the worker agents",
    )

    @classmethod
    def load(cls) -> Config:
        """Load configuration from environment variables and .env file.

        Searches for .env in the agents directory and the project root.
        """
        agents_dir = Path(__file__).resolve().parent.parent
        load_dotenv(agents_dir / ".env")

        project_root = _find_project_root()
        load_dotenv(Path(project_root) / ".env")

        return cls(
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
            project_root=project_root,
            max_budget_per_service=float(
                os.getenv("MAX_BUDGET_PER_SERVICE", "5.0")
            ),
            max_iterations=int(os.getenv("MAX_ITERATIONS", "3")),
            orchestrator_model=os.getenv("ORCHESTRATOR_MODEL", "opus"),
            agent_model=os.getenv("AGENT_MODEL", "sonnet"),
        )

    def validate_api_key(self) -> bool:
        """Check that an API key is present."""
        return bool(self.anthropic_api_key) and self.anthropic_api_key != "sk-ant-xxxxx"
