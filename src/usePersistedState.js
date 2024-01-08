import { useState, useEffect, useCallback } from "react";
import { set, get } from "idb-keyval";

export function usePersistedState(keyToPersistWith, defaultState) {
    const [state, setState] = useState(defaultState);

    useEffect(() => {
        get(keyToPersistWith).then((retrievedState) =>
            // If a value is retrieved then use it; otherwise default to defaultValue
            setState(retrievedState ?? defaultState)
        );
    }, [keyToPersistWith, setState, defaultState]);

    const setPersistedValue = useCallback(
        (newValue) => {
            setState(newValue);
            set(keyToPersistWith, newValue);
        },
        [keyToPersistWith, setState]
    );

    return [state, setPersistedValue];
}
