// src/components/enhanced-stepper/index.tsx
'use client';

import React, { useState } from 'react';
import { Check, Download, ChevronLeft, ChevronRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from 'flowbite-react';
import { Step, StepperUIProps } from './stepper-types';
import SignatureModal from './signature-modal';

const StepperUI = ({ initialStep = 1, onStepComplete, onStepChange }: StepperUIProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());
  const [assigneeConfirmed, setAssigneeConfirmed] = useState(new Set<number>());
  const [managerVerified, setManagerVerified] = useState(new Set<number>());
  const [showWarning, setShowWarning] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState(new Set<number>([initialStep]));
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);


  const steps: Step[] = [
    {
      number: 1,
      title: 'Download Requirements',
      subtitle: 'Project Documentation Phase',
      description: 'Download and review all project requirements and specifications.',
      downloadUrl: '/requirements.pdf',
      requiredRole: 'developer'
    },
    {
      number: 2,
      title: 'System Design',
      subtitle: 'Architecture Planning Phase',
      description: 'Review and approve the system architecture design documents.',
      downloadUrl: '/design.pdf',
      requiredRole: 'architect'
    },
    {
      number: 3,
      title: 'Implementation',
      subtitle: 'Development Phase',
      description: 'Download the implementation guidelines and coding standards.',
      downloadUrl: '/implementation.pdf',
      requiredRole: 'developer'
    },
    {
      number: 4,
      title: 'Testing',
      subtitle: 'QA Phase',
      description: 'Execute test cases and document results.',
      downloadUrl: '/testing.pdf',
      requiredRole: 'qa'
    },
    {
      number: 5,
      title: 'Deployment',
      subtitle: 'Production Phase',
      description: 'Deploy to production environment.',
      downloadUrl: '/deployment.pdf',
      requiredRole: 'devops'
    }
  ];

  const handleSignatureSubmit = (signatureData: string) => {
    setSignature(signatureData);
    handleManagerVerify(currentStep);
    // You might want to save the signature data to your backend here
  };

  const handleNext = () => {
    if (currentStep < steps.length && canProceedToNextStep()) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Collapse previous step and expand next step
      const newExpanded = new Set<number>([nextStep]);
      setExpandedSteps(newExpanded);
      
      onStepChange?.(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Collapse current step and expand previous step
      const newExpanded = new Set<number>([prevStep]);
      setExpandedSteps(newExpanded);
      
      onStepChange?.(prevStep);
    }
  };

  const toggleStepExpansion = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber);
    } else {
      newExpanded.add(stepNumber);
    }
    setExpandedSteps(newExpanded);
  };

  const canProceedToNextStep = () => {
    return assigneeConfirmed.has(currentStep) && managerVerified.has(currentStep);
  };

  const handleAssigneeConfirm = (stepNumber: number) => {
    setShowWarning(false);
    const newConfirmed = new Set(assigneeConfirmed);
    if (newConfirmed.has(stepNumber)) {
      newConfirmed.delete(stepNumber);
      // Also remove manager verification if assignee confirmation is removed
      const newVerified = new Set(managerVerified);
      newVerified.delete(stepNumber);
      setManagerVerified(newVerified);
    } else {
      newConfirmed.add(stepNumber);
    }
    setAssigneeConfirmed(newConfirmed);
  };

  const handleManagerVerify = (stepNumber: number) => {
    if (!assigneeConfirmed.has(stepNumber)) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    const newVerified = new Set(managerVerified);
    if (newVerified.has(stepNumber)) {
      newVerified.delete(stepNumber);
    } else {
      newVerified.add(stepNumber);
    }
    setManagerVerified(newVerified);

    const newCompleted = new Set(completedSteps);
    if (newVerified.has(stepNumber)) {
      newCompleted.add(stepNumber);
      onStepComplete?.(stepNumber, true);
    } else {
      newCompleted.delete(stepNumber);
      onStepComplete?.(stepNumber, false);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-6xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="mt-1 text-gray-600">
            {steps[currentStep - 1].subtitle}
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-2
                  ${currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep === steps.length || !canProceedToNextStep()}
                className={`px-4 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-2
                  ${currentStep === steps.length || !canProceedToNextStep()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                  }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex gap-8">
              {/* Steps List */}
              <div className="w-1/3">
                <div className="flex flex-col space-y-8">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-start group">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer
                            ${
                              completedSteps.has(step.number)
                                ? 'bg-green-500 text-white'
                                : currentStep === step.number
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                            }`}
                          onClick={() => toggleStepExpansion(step.number)}
                        >
                          {completedSteps.has(step.number) ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            step.number
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="h-14 w-0.5 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleStepExpansion(step.number)}
                        >
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${
                              currentStep === step.number ? 'text-blue-500' : 'text-gray-700'
                            }`}>
                              {step.title}
                            </h3>
                            {expandedSteps.has(step.number) ? (
                              <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                        {expandedSteps.has(step.number) && (
                          <>
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded mt-2 inline-block ${
                              completedSteps.has(step.number) 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {step.requiredRole}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">{step.subtitle}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Details */}
              <div className="w-2/3">
                <Card>
                  <div className="p-6">
                    {showWarning && (
                      <div className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Assignee must confirm completion before manager verification</span>
                      </div>
                    )}

                    {!canProceedToNextStep() && currentStep !== steps.length && (
                      <div className="flex p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>Both assignee confirmation and manager verification are required to proceed</span>
                      </div>
                    )}

                    <p className="text-gray-600 mb-6">
                      {steps[currentStep - 1].description}
                    </p>

                    <button className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none inline-flex items-center justify-center gap-2 mb-6">
                      <Download className="w-4 h-4" />
                      Download Resources
                    </button>

                    <div className="border-t border-gray-200 my-6"></div>

                    {currentStep === steps.length && (
                    <>
                      <div className="border-t border-gray-200 my-6"></div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Final Approval</h4>
                        {signature ? (
                          <div className="space-y-2">
                            <p className="text-sm text-green-600">E-signature captured successfully</p>
                            <img 
                              src={signature} 
                              alt="Signature" 
                              className="max-h-20 border border-gray-200 rounded p-2"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsSignatureModalOpen(true)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            Capture E-Signature
                          </button>
                        )}
                      </div>
                    </>
                  )}
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Step Verification</h4>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between py-2 px-1">
                          <span className="text-gray-700">Assignee Confirmation</span>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                            checked={assigneeConfirmed.has(currentStep)}
                            onChange={() => handleAssigneeConfirm(currentStep)}
                          />
                        </label>
                        <label className="flex items-center justify-between py-2 px-1">
                          <span className="text-gray-700">Manager Verification</span>
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                            checked={managerVerified.has(currentStep)}
                            onChange={() => handleManagerVerify(currentStep)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <SignatureModal
                    isOpen={isSignatureModalOpen}
                    onClose={() => setIsSignatureModalOpen(false)}
                    onSubmit={handleSignatureSubmit}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepperUI;