import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            einkaufspreisFormel: '{preis} * {anzahl}',
            aufwandsentschaedigungFormel: '{zeitaufwand} * {stundenlohn}',

            setMwst: (value) => set({ mwst: value }),
            setStundenlohn: (value) => set({ stundenlohn: value }),
            setSchnittpreis: (value) => set({ schnittpreis: value }),
            setEinkaufspreisFormel: (value) => set({ einkaufspreisFormel: value }),
            setAufwandsentschaedigungFormel: (value) => set({ aufwandsentschaedigungFormel: value }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Formula parser utility
export const parseFormula = (
    formula: string,
    variables: Record<string, number>
): number => {
    try {
        let expression = formula;

        // Replace all variables with their values
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            expression = expression.replace(regex, String(value));
        });

        // Simple math expression evaluator (supports +, -, *, /, parentheses)
        // Security: Only allow numbers, operators, parentheses, and spaces
        if (!/^[\d\s+\-*/().]+$/.test(expression)) {
            console.warn('Invalid formula expression:', expression);
            return 0;
        }

        // Use Function constructor for safe math evaluation
        const result = new Function(`return ${expression}`)();
        return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
        console.warn('Formula parsing error:', error);
        return 0;
    }
};
