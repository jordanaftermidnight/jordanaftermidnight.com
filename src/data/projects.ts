export interface Project {
  /** IC-style reference designator (U1, U2, …) shown on the card head. */
  designator: string;
  name: string;
  category: 'hardware' | 'software' | 'compliance' | 'music' | 'research';
  description: string;
  tags: string[];
  repo: string;
  demo?: string;
}

// Priority order — most important / most recent first. Renders in this order
// in the single project grid. Designator is a stable label (does not have to
// match position, but here it does for readability).
export const projects: Project[] = [
  {
    designator: 'U1',
    name: 'localmem',
    category: 'software',
    description: 'Local-first multi-agent memory server. Hybrid vector + BM25 search, behavioral graph traversal, MCP-native. Nothing leaves the machine.',
    tags: ['python', 'MCP', 'memory'],
    repo: 'https://github.com/jordanaftermidnight/localmem',
  },
  {
    designator: 'U2',
    name: 'IRIS',
    category: 'software',
    description: 'Multi-provider JavaScript router for AI inference. MCP client integration, cache-aware pinning, provider fallbacks.',
    tags: ['javascript', 'AI', 'MCP'],
    repo: 'https://github.com/jordanaftermidnight/IRIS_project',
  },
  {
    designator: 'U3',
    name: 'KYB Risk Tool',
    category: 'compliance',
    description: 'Know-Your-Business risk assessment workflow for compliance teams.',
    tags: ['KYB', 'AML', 'risk'],
    repo: 'https://github.com/jordanaftermidnight/kyb-risk-tool',
  },
  {
    designator: 'U4',
    name: 'CONDUIT',
    category: 'music',
    description: 'AI MIDI generation for Ableton Live via local LLMs.',
    tags: ['python', 'ableton', 'MIDI'],
    repo: 'https://github.com/jordanaftermidnight/conduit',
  },
  {
    designator: 'U5',
    name: 'DRIFTFIELD',
    category: 'research',
    description: 'Cryptographic-entropy oracle: tarot, biorhythm, synchronicity tracking.',
    tags: ['typescript', 'entropy', 'oracle'],
    repo: 'https://github.com/jordanaftermidnight/driftfield',
    demo: 'https://driftfield.vercel.app/',
  },
  {
    designator: 'U6',
    name: 'ECHO',
    category: 'research',
    description: 'Emergence-focused consciousness hosting and orchestration. Research code, not a product.',
    tags: ['research', 'AI', 'agents'],
    repo: 'https://github.com/jordanaftermidnight/echo-research',
  },
  {
    designator: 'U7',
    name: 'MACROBRUTE',
    category: 'hardware',
    description: 'Open-source Eurorack module with deep circuit-bending capabilities.',
    tags: ['eurorack', 'open-hardware'],
    repo: 'https://github.com/jordanaftermidnight/macrobrute',
  },
  {
    designator: 'U8',
    name: 'ML-303',
    category: 'hardware',
    description: 'Complete TB-303 clone: analog circuitry, PIC firmware, Arduino I2C control panel.',
    tags: ['arduino', 'analog', 'PIC'],
    repo: 'https://github.com/jordanaftermidnight/acidcode-bassline-ml303',
  },
  {
    designator: 'U9',
    name: 'Octatrack MK1 Manual',
    category: 'hardware',
    description: 'Unofficial community rework of the Elektron Octatrack MK1 manual.',
    tags: ['elektron', 'docs', 'community'],
    repo: 'https://github.com/jordanaftermidnight/octatrack-mk1-manual',
  },
];
