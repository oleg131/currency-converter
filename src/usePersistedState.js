import { useState, useCallback } from "react";

export function usePersistedState(keyToPersistWith, defaultState) {
    const [state, setState] = useState(() => {
        try {
            const stored = localStorage.getItem(keyToPersistWith);
            return stored !== null ? JSON.parse(stored) : defaultState;
        } catch {
            return defaultState;
        }
    });

    const setPersistedValue = useCallback(
        (newValue) => {
            setState(newValue);
            localStorage.setItem(keyToPersistWith, JSON.stringify(newValue));
        },
        [keyToPersistWith]
    );

    return [state, setPersistedValue];
}
