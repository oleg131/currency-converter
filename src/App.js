import React from "react";
import { get, set } from "idb-keyval";

import { usePersistedState } from "./usePersistedState.js";

import "./App.css";

const URL = "https://open.er-api.com/v6/latest/";
const BASE = "USD";

function App() {
    const [baseCurrency, setBaseCurrency] = usePersistedState(
        "baseCurrency",
        BASE
    );
    const [baseValue, setBaseValue] = usePersistedState("baseValue", 1);
    const [currencies, setCurrencies] = usePersistedState("currencies", [
        baseCurrency,
    ]);

    const [rates, setRates] = usePersistedState("rates", null);
    const [updated, setUpdated] = usePersistedState("updated", null);

    // React.useEffect(() => {
    //     get("currencies").then((val) => setCurrencies(val));
    // }, []);

    // React.useEffect(() => {
    //     set("currencies", currencies)
    //         .then(() => console.log("currencies saved"))
    //         .catch((err) => console.log("currencies save failed", err));
    // }, [currencies]);

    React.useEffect(() => {
        fetch(URL + BASE)
            .then((res) => res.json())
            .then((data) => {
                setRates(data.rates);
                setUpdated(new Date());
            });
    }, []);

    function processCurrency(currency) {
        if (!rates) {
            return -1;
        }

        const rate = rates[currency] / rates[baseCurrency];
        const value = baseValue * rate;
        return value;
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className="text-sm font-light">
                    Rates updated: {updated ? updated.toISOString() : "Never"}
                </div>
                <div className="mx-auto w-full max-w-sm">
                    <div
                        id="latest_rates_display"
                        className="mx-auto my-5 w-full max-w-sm bg-white shadow rounded-md px-5 py-3 text-sm empty:hidden divide-y divide-dotted divide-slate-300 text-black"
                    >
                        {currencies.map((currency, index) => (
                            <div
                                className="flex items-center justify-between py-2"
                                key={index}
                            >
                                <strong
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setCurrencies(
                                            currencies.filter(
                                                (_, ix) => ix !== index
                                            )
                                        );
                                    }}
                                >
                                    {currency}
                                </strong>
                                <span
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        const value = prompt("Enter new value");
                                        if (value) {
                                            setBaseCurrency(currency);
                                            setBaseValue(parseFloat(value));
                                        }
                                    }}
                                >
                                    {processCurrency(currency)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            const currency = prompt("Enter currency code");
                            if (currency) {
                                setCurrencies([
                                    ...currencies,
                                    currency.toUpperCase(),
                                ]);
                            }
                        }}
                    >
                        +
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
