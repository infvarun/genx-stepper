'use client';

import StepperUI from '@/components/enhanced-stepper';

export default function Home() {
  const handleStepComplete = (stepNumber: number, isCompleted: boolean) => {
    console.log(`Step ${stepNumber} ${isCompleted ? 'completed' : 'uncompleted'}`);
  };

  const handleStepChange = (newStep: number) => {
    console.log(`Moving to step ${newStep}`);
  };

  return (
    <main>
      <StepperUI 
        initialStep={1}
        onStepComplete={handleStepComplete}
        onStepChange={handleStepChange}
      />
    </main>
  );
}