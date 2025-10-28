export interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  content: SlideContent[];
  codeExample?: CodeExample;
  diagram?: DiagramConfig;
  notes?: string;
  animation?: SlideAnimation;
  problemSolution?: ProblemSolution;
}

export interface SlideContent {
  type:
    | 'text'
    | 'bullet'
    | 'highlight'
    | 'comparison'
    | 'timeline'
    | 'code-demo'
    | 'problem-solution'
    | 'success-story'
    | 'success-metrics'
    | 'migration-timeline'
    | 'call-to-action'
    | 'table';
  content: string;
  subItems?: string[];
  comparison?: {
    before: string;
    after: string;
  };
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface CodeExample {
  language: string;
  code: string;
  title?: string;
  explanation?: string;
}

export interface SlideAnimation {
  entrance: string;
  duration: number;
}

export interface PresentationData {
  title: string;
  slides: SlideData[];
  theme: 'dark' | 'light' | 'angular';
}

export interface ProblemSolution {
  problem: string;
  solution: string;
  benefits: string[];
  implementation?: string;
}

export interface DiagramConfig {
  type:
    | 'component-tree'
    | 'zone-flow'
    | 'signals-flow'
    | 'performance-comparison'
    | 'strategy-comparison'
    | 'onpush-tree'
    | 'targeted-change-detection'
    | 'dirty-marking-flow'
    | 'zoneless-architecture'
    | 'signal-dependency-graph'
    | 'async-problem-demo'
    | 'signal-apis-flow'
    | 'migration-flow'
    | 'future-roadmap'
    | 'angularjs-overview'
    | 'angularjs-performance'
    | 'angularjs-to-angular-evolution'
    | 'ngzone-wrapper'
    | 'immutability-patterns'
    | 'onpush-triggers'
    | 'async-pipe-flow'
    | 'manual-cd-methods'
    | 'angular-bootstrap-flow'
    | 'cd-tick-cycle'
    | 'dirty-marking-tree'
    | 'event-listener-wrapping'
    | 'ngzone-component-tree';
  title?: string;
  animated?: boolean;
}
