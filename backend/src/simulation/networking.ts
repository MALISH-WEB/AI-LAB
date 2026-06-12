import { NetworkingScenario } from '@ai-lab/shared';

export const NETWORKING_SCENARIOS: NetworkingScenario[] = [
  {
    id: 'network-basic-config',
    title: 'Scenario 1: Basic Network Configuration',
    objective: 'Configure IP addresses and subnet masks for hosts and routers.',
    expectedActions: ['set-ip', 'set-subnet', 'run-ping-check']
  },
  {
    id: 'routing-setup',
    title: 'Scenario 2: Routing Protocol Setup',
    objective: 'Configure OSPF or BGP and verify route convergence.',
    expectedActions: ['enable-ospf', 'enable-bgp', 'verify-routing-table']
  },
  {
    id: 'network-troubleshooting',
    title: 'Scenario 3: Network Troubleshooting',
    objective: 'Identify and fix misconfiguration causing packet loss.',
    expectedActions: ['inspect-interface', 'check-route', 'fix-misconfiguration']
  }
];

export class NetworkingSimulationEngine {
  validateAction(scenarioId: string, action: string): { valid: boolean; feedback: string; scoreDelta: number } {
    const scenario = NETWORKING_SCENARIOS.find((item) => item.id === scenarioId);
    if (!scenario) {
      return { valid: false, feedback: 'Unknown scenario selected.', scoreDelta: 0 };
    }

    const isExpected = scenario.expectedActions.includes(action);

    if (!isExpected) {
      return {
        valid: false,
        feedback: 'Action does not align with the scenario objective. Review topology and protocol requirements.',
        scoreDelta: -5
      };
    }

    return {
      valid: true,
      feedback: `Great step. \"${action}\" advanced the scenario toward completion.`,
      scoreDelta: 15
    };
  }
}
