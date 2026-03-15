"""Artifact path helpers for inter-agent file passing.

All agents read and write to a shared artifact directory structure:

    artifacts/
        {service-name}/
            spec.md          - PM output
            design-spec.md   - Designer output
            qa-report.md     - QA output
            ...additional files as needed
"""

from __future__ import annotations

from pathlib import Path


def get_artifact_dir(project_root: str, service_name: str) -> Path:
    """Return the artifact directory for a given service.

    Does NOT create the directory -- use ensure_artifact_dir for that.
    """
    return Path(project_root) / "artifacts" / service_name


def get_spec_path(project_root: str, service_name: str) -> Path:
    """Return the path to the PM spec for a service."""
    return get_artifact_dir(project_root, service_name) / "spec.md"


def get_design_path(project_root: str, service_name: str) -> Path:
    """Return the path to the design spec for a service."""
    return get_artifact_dir(project_root, service_name) / "design-spec.md"


def get_qa_report_path(project_root: str, service_name: str) -> Path:
    """Return the path to the QA report for a service."""
    return get_artifact_dir(project_root, service_name) / "qa-report.md"


def get_scaffold_manifest_path(project_root: str, service_name: str) -> Path:
    """Return the path to the scaffold manifest for a service."""
    return get_artifact_dir(project_root, service_name) / "scaffold-manifest.md"


def get_implementation_log_path(project_root: str, service_name: str) -> Path:
    """Return the path to the implementation log for a service."""
    return get_artifact_dir(project_root, service_name) / "implementation-log.md"


def ensure_artifact_dir(project_root: str, service_name: str) -> Path:
    """Create the artifact directory for a service if it does not exist.

    Returns the artifact directory path.
    """
    artifact_dir = get_artifact_dir(project_root, service_name)
    artifact_dir.mkdir(parents=True, exist_ok=True)
    return artifact_dir


def list_artifact_files(project_root: str, service_name: str) -> list[Path]:
    """List all files in a service's artifact directory."""
    artifact_dir = get_artifact_dir(project_root, service_name)
    if not artifact_dir.exists():
        return []
    return sorted(artifact_dir.iterdir())


def artifact_exists(project_root: str, service_name: str, filename: str) -> bool:
    """Check whether a specific artifact file exists."""
    return (get_artifact_dir(project_root, service_name) / filename).exists()
