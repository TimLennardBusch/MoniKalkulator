import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  mwst: number;
  stundenlohn: number;
  schnittpreis: number;
  einkaufspreisFormel: string;
  aufwandsentschaedigungFormel: string;
  setMwst: (value: number) => void;
  setStundenlohn: (value: number) => void;
  setSchnittpreis: (value: number) => void;
  setEinkaufspreisFormel: (value: string) => void;
  setAufwandsentschaedigungFormel: (value: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mwst: 19,
      stundenlohn: 60,
      schnittpreis: 60,
      einkaufspreisFormel: '{preis} * {anzahl} * (1 + {mwst}/100)',
      aufwandsentschaedigungFormel: '{zeitaufwand} * {stundenlohn}',

      setMwst: (value) => set({ mwst: value }),
      setStundenlohn: (value) => set({ stundenlohn: value }),
      setSchnittpreis: (value) => set({ schnittpreis: value }),
      setEinkaufspreisFormel: (value) => set({ einkaufspreisFormel: value }),
      setAufwandsentschaedigungFormel: (value) => set({ aufwandsentschaedigungFormel: value }),
    }),
    {
      name: 'moni-settings',
    }
  )
);

export function parseFormula(
  formula: string,
  variables: Record<string, number>
): number {
  try {
    let expression = formula;
    for (const [key, value] of Object.entries(variables)) {
      expression = expression.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }
    // Simple safe eval for basic math
    const result = Function(`"use strict"; return (${expression})`)();
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch {
    return 0;
  }
}
