'use client';

import { create } from 'zustand';

interface CalculatorState {
  currentStep: number;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  industryId: string;
  websiteType: string;
  packageId: string;
  pages: number;
  selectedFeatureIds: string[];
  rushDelivery: boolean;

  // Wizard Traversal Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFields: (fields: Partial<Omit<CalculatorState, 'setStep' | 'nextStep' | 'prevStep' | 'updateFields' | 'reset'>>) => void;
  reset: () => void;
}

const initialFields = {
  currentStep: 1,
  businessName: '',
  businessEmail: '',
  businessPhone: '',
  industryId: '',
  websiteType: '',
  packageId: '',
  pages: 5,
  selectedFeatureIds: [],
  rushDelivery: false,
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  ...initialFields,

  setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 8) }),
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 8) })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  updateFields: (fields) => set((state) => ({ ...state, ...fields })),

  reset: () => set(initialFields),
}));
