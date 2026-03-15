"""Agent definitions for the multi-agent orchestration system.

Defines the tools, prompts, and configuration for each specialized agent.
Uses TYPE_CHECKING to avoid import errors when claude_agent_sdk is not installed.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from agents.prompts import backend as backend_prompts
from agents.prompts import designer as designer_prompts
from agents.prompts import frontend as frontend_prompts
from agents.prompts import orchestrator as orchestrator_prompts
from agents.prompts import pm as pm_prompts
from agents.prompts import qa as qa_prompts

if TYPE_CHECKING:
    pass

# ---------------------------------------------------------------------------
# Tool sets -- each agent gets only the tools it needs
# ---------------------------------------------------------------------------

PM_TOOLS: list[str] = ["Read", "Write", "Glob", "Grep", "WebSearch", "WebFetch"]
"""PM needs web access for keyword research and competitor analysis."""

DESIGNER_TOOLS: list[str] = ["Read", "Write", "Glob", "Grep"]
"""Designer reads specs and existing UI components, writes design spec."""

FRONTEND_TOOLS: list[str] = ["Read", "Write", "Edit", "Bash", "Glob", "Grep"]
"""Frontend needs full file manipulation and shell for builds."""

BACKEND_TOOLS: list[str] = ["Read", "Write", "Edit", "Bash", "Glob", "Grep"]
"""Backend needs full file manipulation and shell for builds."""

QA_TOOLS: list[str] = ["Read", "Write", "Edit", "Bash", "Glob", "Grep"]
"""QA needs full access for testing, auditing, and report writing."""

ORCHESTRATOR_TOOLS: list[str] = ["Read", "Write", "Glob", "Grep", "Bash"]
"""Orchestrator needs to inspect artifacts and run verification commands."""


# ---------------------------------------------------------------------------
# Agent definition data class
# ---------------------------------------------------------------------------

@dataclass
class AgentDefinition:
    """Defines a single agent's configuration for the orchestration system."""

    name: str
    description: str
    system_prompt: str
    tools: list[str]
    model: str
    max_tokens: int = 16384

    def build_prompt(self, service_name: str, service_description: str = "") -> str:
        """Build the full prompt for this agent with service-specific context.

        Prepends service context to the base system prompt so that each agent
        knows what service it is working on and where artifacts live.
        """
        context_header = (
            f"## Current Task Context\n"
            f"- **Service name**: {service_name}\n"
            f"- **Service description**: {service_description}\n"
            f"- **Artifact directory**: artifacts/{service_name}/\n"
            f"- **App directory**: apps/{service_name}/\n"
            f"- **API directory**: apps/{service_name}-api/ (if backend is needed)\n"
            f"\n---\n\n"
        )
        return context_header + self.system_prompt


# ---------------------------------------------------------------------------
# Agent factory
# ---------------------------------------------------------------------------

def get_agents(
    orchestrator_model: str = "opus",
    agent_model: str = "sonnet",
    max_iterations: int = 3,
    max_budget: float = 5.0,
) -> dict[str, AgentDefinition]:
    """Return a dictionary of all agent definitions.

    Parameters
    ----------
    orchestrator_model:
        Model identifier for the orchestrator (e.g. "opus", "sonnet").
    agent_model:
        Model identifier for the worker agents.
    max_iterations:
        Maximum QA retry iterations. Injected into the orchestrator prompt.
    max_budget:
        Dollar budget per service run. Injected into the orchestrator prompt.

    Returns
    -------
    dict mapping agent name to AgentDefinition.
    """

    # Inject runtime values into the orchestrator prompt
    orch_prompt = orchestrator_prompts.SYSTEM_PROMPT.replace(
        "{max_iterations}", str(max_iterations)
    ).replace(
        "{max_budget}", f"{max_budget:.2f}"
    )

    return {
        "orchestrator": AgentDefinition(
            name="orchestrator",
            description=(
                "Lead agent that coordinates the PM, Designer, Frontend, Backend, "
                "and QA agents through a sequential pipeline to build a complete "
                "web service. Manages quality gates and iteration loops."
            ),
            system_prompt=orch_prompt,
            tools=ORCHESTRATOR_TOOLS,
            model=orchestrator_model,
            max_tokens=32768,
        ),
        "pm": AgentDefinition(
            name="pm",
            description=(
                "Product Manager agent that creates comprehensive product "
                "specifications including SEO keyword research, competitor "
                "analysis, monetization strategy, user stories, and task "
                "breakdown. Writes artifacts/{service}/spec.md."
            ),
            system_prompt=pm_prompts.SYSTEM_PROMPT,
            tools=PM_TOOLS,
            model=agent_model,
        ),
        "designer": AgentDefinition(
            name="designer",
            description=(
                "UI/UX Designer agent that creates responsive layout designs, "
                "component hierarchies, ad slot placements, design tokens, and "
                "accessibility specifications. Reads the PM spec and writes "
                "artifacts/{service}/design-spec.md."
            ),
            system_prompt=designer_prompts.SYSTEM_PROMPT,
            tools=DESIGNER_TOOLS,
            model=agent_model,
        ),
        "frontend": AgentDefinition(
            name="frontend",
            description=(
                "Frontend Developer agent specializing in Next.js on Cloudflare "
                "Pages. Implements pages, components, hooks, and styles using "
                "Tailwind CSS. Integrates @repo/seo, @repo/ads, @repo/analytics, "
                "and @repo/ui packages. Targets Lighthouse SEO 90+ and "
                "Performance 90+."
            ),
            system_prompt=frontend_prompts.SYSTEM_PROMPT,
            tools=FRONTEND_TOOLS,
            model=agent_model,
        ),
        "backend": AgentDefinition(
            name="backend",
            description=(
                "Backend Developer agent for Cloudflare Workers. Implements Hono "
                "routes, Drizzle ORM schemas, and D1 integration. Only invoked "
                "when the service requires server-side data or dynamic endpoints. "
                "Writes Cloudflare Workers-compatible code (no Node.js APIs)."
            ),
            system_prompt=backend_prompts.SYSTEM_PROMPT,
            tools=BACKEND_TOOLS,
            model=agent_model,
        ),
        "qa": AgentDefinition(
            name="qa",
            description=(
                "QA Engineer agent that writes Vitest tests, runs them, performs "
                "code review, checks SEO compliance, audits ad integration, and "
                "produces artifacts/{service}/qa-report.md with a PASS/FAIL grade."
            ),
            system_prompt=qa_prompts.SYSTEM_PROMPT,
            tools=QA_TOOLS,
            model=agent_model,
        ),
    }


def get_agent(
    name: str,
    orchestrator_model: str = "opus",
    agent_model: str = "sonnet",
    **kwargs,
) -> AgentDefinition:
    """Get a single agent definition by name.

    Raises KeyError if the agent name is not recognized.
    """
    agents = get_agents(
        orchestrator_model=orchestrator_model,
        agent_model=agent_model,
        **kwargs,
    )
    return agents[name]
