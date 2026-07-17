'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  customFeatures: { id: string; name: string; price: number }[];

  // Wizard Traversal Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFields: (fields: Partial<Omit<CalculatorState, 'setStep' | 'nextStep' | 'prevStep' | 'updateFields' | 'reset' | 'addCustomFeature' | 'removeCustomFeature'>>) => void;
  addCustomFeature: (feature: { name: string; price: number }) => void;
  removeCustomFeature: (id: string) => void;
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
  customFeatures: [],
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      ...initialFields,

  setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 6) }),
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  updateFields: (fields) => set((state) => ({ ...state, ...fields })),

  addCustomFeature: (feat) => set((state) => ({
    customFeatures: [
      ...state.customFeatures,
      {
        id: 'custom_feat_' + Math.random().toString(36).substring(2, 9),
        name: feat.name,
        price: feat.price,
      }
    ]
  })),

  removeCustomFeature: (id) => set((state) => ({
    customFeatures: state.customFeatures.filter((f) => f.id !== id)
  })),

      reset: () => set(initialFields),
    }),
    {
      name: 'website-calculator-storage',
    }
  )
);
