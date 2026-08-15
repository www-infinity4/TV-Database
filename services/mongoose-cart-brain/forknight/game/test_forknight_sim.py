import unittest

from forknight_sim import ForknightSimulation, Project


class ForknightSimulationTests(unittest.TestCase):
    def test_only_authorized_projects_are_added_explicitly(self):
        game = ForknightSimulation()
        self.assertEqual(game.projects, [])
        game.add_authorized_project(Project("Cosmo", "model", 20))
        self.assertEqual([item.name for item in game.projects], ["Cosmo"])

    def test_seeded_ticks_are_reproducible(self):
        left = ForknightSimulation(seed=7)
        right = ForknightSimulation(seed=7)
        for game in (left, right):
            game.add_authorized_project(Project("Cosmo", "model", 20))
        self.assertEqual(left.tick(), right.tick())

    def test_tick_reduces_debt_without_going_negative(self):
        game = ForknightSimulation(seed=2)
        project = Project("Cosmo", "model", 1)
        game.add_authorized_project(project)
        game.tick()
        self.assertGreaterEqual(project.tech_debt, 0)


if __name__ == "__main__":
    unittest.main()
