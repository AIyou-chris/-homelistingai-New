import { useState, useEffect } from 'react';

export interface UserFlowState {
  hasViewedSales: boolean;
  hasSignedUp: boolean;
  hasViewedWelcome: boolean;
  hasBuiltAgent: boolean;
  hasReviewedApp: boolean;
  hasCompletedPayment: boolean;
  currentStep: number;
}

export enum FlowStep {
  SALES = 0,
  SIGNUP = 1,
  WELCOME = 2,
  AGENT_BUILDER = 3,
  APP_REVIEW = 4,
  PAYMENT = 5,
  DASHBOARD = 6
}

const FLOW_STORAGE_KEY = 'homelistingai_user_flow';

const initialFlowState: UserFlowState = {
  hasViewedSales: false,
  hasSignedUp: false,
  hasViewedWelcome: false,
  hasBuiltAgent: false,
  hasReviewedApp: false,
  hasCompletedPayment: false,
  currentStep: FlowStep.SALES
};

export const useUserFlow = () => {
  const [flowState, setFlowState] = useState<UserFlowState>(() => {
    const stored = localStorage.getItem(FLOW_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialFlowState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flowState));
  }, [flowState]);

  const updateFlowState = (updates: Partial<UserFlowState>) => {
    setFlowState(prev => ({ ...prev, ...updates }));
  };

  const markStepCompleted = (step: FlowStep) => {
    const updates: Partial<UserFlowState> = {
      currentStep: Math.max(flowState.currentStep, step + 1)
    };

    switch (step) {
      case FlowStep.SALES:
        updates.hasViewedSales = true;
        break;
      case FlowStep.SIGNUP:
        updates.hasSignedUp = true;
        break;
      case FlowStep.WELCOME:
        updates.hasViewedWelcome = true;
        break;
      case FlowStep.AGENT_BUILDER:
        updates.hasBuiltAgent = true;
        break;
      case FlowStep.APP_REVIEW:
        updates.hasReviewedApp = true;
        break;
      case FlowStep.PAYMENT:
        updates.hasCompletedPayment = true;
        break;
    }

    updateFlowState(updates);
  };

  const getNextStep = (): string => {
    if (!flowState.hasViewedSales) return '/';
    if (!flowState.hasSignedUp) return '/signup';
    if (!flowState.hasViewedWelcome) return '/welcome';
    if (!flowState.hasBuiltAgent) return '/upload';
    if (!flowState.hasReviewedApp) return '/app-review';
    if (!flowState.hasCompletedPayment) return '/checkout';
    return '/dashboard';
  };

  const canAccessStep = (step: FlowStep): boolean => {
    switch (step) {
      case FlowStep.SALES:
        return true;
      case FlowStep.SIGNUP:
        return flowState.hasViewedSales;
      case FlowStep.WELCOME:
        return flowState.hasSignedUp;
      case FlowStep.AGENT_BUILDER:
        return flowState.hasViewedWelcome;
      case FlowStep.APP_REVIEW:
        return flowState.hasBuiltAgent;
      case FlowStep.PAYMENT:
        return flowState.hasReviewedApp;
      case FlowStep.DASHBOARD:
        return flowState.hasCompletedPayment;
      default:
        return false;
    }
  };

  const getProgressPercentage = (): number => {
    return Math.round((flowState.currentStep / FlowStep.DASHBOARD) * 100);
  };

  const resetFlow = () => {
    setFlowState(initialFlowState);
    localStorage.removeItem(FLOW_STORAGE_KEY);
  };

  const allowSkipping = (step: FlowStep): boolean => {
    // Allow skipping certain steps for demo purposes
    switch (step) {
      case FlowStep.APP_REVIEW:
        return true; // Users can skip app review if they're satisfied
      case FlowStep.AGENT_BUILDER:
        return true; // Users can skip agent builder if they want to see demo first
      default:
        return false;
    }
  };

  return {
    flowState,
    markStepCompleted,
    getNextStep,
    canAccessStep,
    getProgressPercentage,
    resetFlow,
    allowSkipping,
    updateFlowState
  };
}; 