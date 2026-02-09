export interface LearningStep {
  id: string;
  titleKey: string;
  descriptionKey: string;
  type: 'guide' | 'practice' | 'reference';
  icon?: string;
  substeps?: string[];
}

export interface PracticeAssignment {
  id: string;
  titleKey: string;
  descriptionKey: string;
  checklist: string[];
}

export interface DigitalModuleContent {
  moduleId: string;
  goals: string[];
  preparation: string[];
  steps: LearningStep[];
  tips: string[];
  practices: PracticeAssignment[];
  relatedAppIds: string[];
}

export interface DigitalProgress {
  moduleId: string;
  completedSteps: string[];
  completedPractices: string[];
  completedAt?: string;
}
