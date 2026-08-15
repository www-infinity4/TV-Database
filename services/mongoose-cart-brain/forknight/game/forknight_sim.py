#!/usr/bin/env python3
"""Deterministic FORKNIGHT repository-building simulation."""

from __future__ import annotations

from dataclasses import dataclass, asdict
import json
import random


@dataclass
class Worker:
    name: str
    role: str
    refactor: int
    stability: int
    cost: int


@dataclass
class Project:
    name: str
    zone: str
    tech_debt: int
    tests: int = 0
    status: str = "CATALOGED"


class ForknightSimulation:
    def __init__(self, seed: int = 120):
        self.random = random.Random(seed)
        self.infinity_credits = 5000
        self.stability = 100
        self.projects: list[Project] = []
        self.events: list[dict] = []
        self.workers = [
            Worker("Reader Cart", "reader", 2, 1, 50),
            Worker("Writer Cart", "writer", 4, 0, 100),
            Worker("Coder Cart", "coder", 8, -1, 200),
            Worker("Security Cart", "security", 1, 4, 150),
        ]

    def add_authorized_project(self, project: Project) -> None:
        if any(item.name == project.name for item in self.projects):
            return
        self.projects.append(project)
        self.events.append({"event": "PROJECT_ADDED", "project": project.name})

    def tick(self) -> dict:
        if not self.projects:
            result = {"event": "NO_PROJECT", "credits": self.infinity_credits}
            self.events.append(result)
            return result
        project = self.random.choice(self.projects)
        worker = self.random.choice(self.workers)
        project.tech_debt = max(0, project.tech_debt - worker.refactor)
        project.tests += 1 if worker.role in {"coder", "security"} else 0
        project.status = "VERIFIED" if project.tech_debt == 0 and project.tests else "BUILDING"
        self.stability = max(0, min(100, self.stability + worker.stability))
        reward = max(1, 10 - project.tech_debt // 10)
        self.infinity_credits += reward - worker.cost
        result = {
            "event": "BUILD_TICK",
            "project": project.name,
            "worker": worker.name,
            "debt": project.tech_debt,
            "tests": project.tests,
            "status": project.status,
            "credits": self.infinity_credits,
            "stability": self.stability,
        }
        self.events.append(result)
        return result

    def snapshot(self) -> dict:
        return {
            "credits": self.infinity_credits,
            "stability": self.stability,
            "projects": [asdict(item) for item in self.projects],
            "events": list(self.events),
        }


def demo() -> None:
    game = ForknightSimulation()
    game.add_authorized_project(Project("StarQuest Cosmo", "model-orchestration", 45))
    for _ in range(3):
        print(json.dumps(game.tick(), sort_keys=True))


if __name__ == "__main__":
    demo()
