// src/components/enhanced-stepper/types.ts
export interface Step {
    number: number;
    title: string;
    subtitle: string;
    description: string;
    downloadUrl: string;
    requiredRole: string;
  }
  
  export interface StepperUIProps {
    initialStep?: number;
    onStepComplete?: (stepNumber: number, isCompleted: boolean, timing: StepTiming) => void;
    onStepChange?: (newStep: number) => void;
  }

  export interface StepTiming {
    startTime: Date;
    finishTime?: Date;
  }