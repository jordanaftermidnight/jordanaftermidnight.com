export interface Project {
  name: string;
  category: 'hardware' | 'software' | 'compliance' | 'music' | 'research';
  description: string;
  tags: string[];
  repo: string;
  demo?: string;
}

// Only shipped, public GitHub work. Add more as you push new repos or make
// existing ones public. Private repos should be listed under a separate
// mechanism (e.g. a "Working on" section without hotlinks).
export const projects: Project[] = [
  // ─── Software ───────────────────────────────────────────────────────
  {
    name: 'IRIS',
    category: 'software',
    description: 'Multi-provider JavaScript router for AI inference with MCP client support.',
    tags: ['javascript', 'AI', 'MCP', 'router'],
    repo: 'https://github.com/jordanaftermidnight/IRIS_project',
  },
  {
    name: 'localmem',
    category: 'software',
    description: 'Local-first multi-agent memory server with hybrid search and behavioral graphs.',
    tags: ['python', 'MCP', 'memory'],
    repo: 'https://github.com/jordanaftermidnight/localmem',
  },
  {
    name: 'DRIFTFIELD',
    category: 'software',
    description: 'Experimental time-series analysis and prediction toolkit.',
    tags: ['typescript', 'analysis'],
    repo: 'https://github.com/jordanaftermidnight/driftfield',
  },

  // ─── Compliance ─────────────────────────────────────────────────────
  {
    name: 'KYB Risk Tool',
    category: 'compliance',
    description: 'Know-Your-Business risk assessment workflow for compliance teams.',
    tags: ['KYB', 'AML', 'risk'],
    repo: 'https://github.com/jordanaftermidnight/kyb-risk-tool',
  },

  // ─── Hardware ───────────────────────────────────────────────────────
  {
    name: 'MACROBRUTE',
    category: 'hardware',
    description: 'Eurorack companion module for complex modulation routing.',
    tags: ['eurorack', 'modulation'],
    repo: 'https://github.com/jordanaftermidnight/macrobrute',
  },
  {
    name: 'ML-303',
    category: 'hardware',
    description: 'Acidcode TB-303 clone with Arduino I2C LCD control panel.',
    tags: ['arduino', 'synthesizer', 'i2c'],
    repo: 'https://github.com/jordanaftermidnight/acidcode-bassline-ml303',
  },
  {
    name: 'Octatrack MK1 Manual',
    category: 'hardware',
    description: 'Community reference documentation for the Elektron Octatrack MK1.',
    tags: ['elektron', 'docs', 'sampler'],
    repo: 'https://github.com/jordanaftermidnight/octatrack-mk1-manual',
  },

  // ─── Music / Audio ──────────────────────────────────────────────────
  {
    name: 'CONDUIT',
    category: 'music',
    description: 'Modular signal routing and mixing tool for creative workflows.',
    tags: ['python', 'audio', 'routing'],
    repo: 'https://github.com/jordanaftermidnight/conduit',
  },

  // ─── Research ───────────────────────────────────────────────────────
  {
    name: 'ECHO',
    category: 'research',
    description: 'Multi-modal AI research and experimentation framework.',
    tags: ['research', 'AI'],
    repo: 'https://github.com/jordanaftermidnight/echo-research',
  },
];
