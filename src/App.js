import React from "react";
import { getEmojiByCurrencyCode } from "country-currency-emoji-flags";

import { usePersistedState } from "./usePersistedState.js";
import Keypad from "./Keypad";

import "./App.css";

const URL = "https://open.er-api.com/v6/latest/";
const BASE = "USD";

function App() {
    const [baseCurrency, setBaseCurrency] = usePersistedState(
        "baseCurrency",
        BASE
    );
    const [baseValue, setBaseValue] = usePersistedState("baseValue", "1");
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
    }, [setRates, setUpdated]);

    function processCurrency(currency) {
        if (!rates) {
            return -1;
        }

        const rate = rates[currency] / rates[baseCurrency];
        const value = parseFloat(baseValue) * rate;
        return value;
    }

    function keypadPress(value) {
        if (value === "clear") {
            setBaseValue("0");
        } else {
            console.log(baseValue, value);
            setBaseValue(baseValue + value);
        }
    }

    return (
        <div className="flex flex-col h-screen justify-between bg-gray-800 text-white">
            <main className="mb-auto text-center overflow-scroll">
                <div className="text-sm font-light">
                    Rates updated: {updated ? updated.toISOString() : "Never"}
                </div>
                <div className="mx-auto w-full max-w-sm">
                    <div
                        id="latest_rates_display"
                        className="mx-auto my-5 w-full max-w-sm bg-white shadow rounded-md px-5 py-3 text-3xl empty:hidden divide-y divide-dotted divide-slate-300 text-black"
                    >
                        {currencies.map((currency, index) => (
                            <div className="flex py-2" key={index}>
                                <div
                                    className={`flex items-center justify-between p-2 w-full ${
                                        currency === baseCurrency
                                            ? "border-2 border-blue-800 rounded-md"
                                            : ""
                                    }`}
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
                                        {getEmojiByCurrencyCode(currency)}{" "}
                                        {currency}
                                    </strong>
                                    <div
                                        type="number"
                                        className="cursor-pointer text-right"
                                        onClick={(e) => {
                                            setBaseValue(String("0"));
                                            setBaseCurrency(currency);
                                        }}
                                    >
                                        {currency !== baseCurrency
                                            ? processCurrency(
                                                  currency
                                              ).toLocaleString()
                                            : baseValue !== "0"
                                            ? parseFloat(
                                                  baseValue
                                              ).toLocaleString()
                                            : " "}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="cursor-pointer text-3xl pb-6"
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
            </main>
            <footer className="">
                <Keypad callback={keypadPress} />
            </footer>
        </div>
    );

    // return (
    //     <div className="App">
    //         <div className="App-header">
    //             <div className="text-sm font-light">
    //                 Rates updated: {updated ? updated.toISOString() : "Never"}
    //             </div>
    //             <div className="mx-auto w-full max-w-sm">
    //                 <div
    //                     id="latest_rates_display"
    //                     className="mx-auto my-5 w-full max-w-sm bg-white shadow rounded-md px-5 py-3 text-3xl empty:hidden divide-y divide-dotted divide-slate-300 text-black"
    //                 >
    //                     {currencies.map((currency, index) => (
    //                         <div
    //                             className="flex items-center justify-between py-2"
    //                             key={index}
    //                         >
    //                             <strong
    //                                 className="cursor-pointer"
    //                                 onClick={() => {
    //                                     setCurrencies(
    //                                         currencies.filter(
    //                                             (_, ix) => ix !== index
    //                                         )
    //                                     );
    //                                 }}
    //                             >
    //                                 {getEmojiByCurrencyCode(currency)}{" "}
    //                                 {currency}
    //                             </strong>
    //                             <div
    //                                 type="number"
    //                                 className="cursor-pointer text-right"
    //                                 onClick={(e) => {
    //                                     setBaseValue(0);
    //                                     setBaseCurrency(currency);
    //                                 }}
    //                             >
    //                                 {currency !== baseCurrency
    //                                     ? processCurrency(
    //                                           currency
    //                                       ).toLocaleString()
    //                                     : baseValue !== "0"
    //                                     ? parseFloat(baseValue).toLocaleString()
    //                                     : "_"}
    //                             </div>
    //                         </div>
    //                     ))}
    //                 </div>
    //                 <div
    //                     className="cursor-pointer"
    //                     onClick={() => {
    //                         const currency = prompt("Enter currency code");
    //                         if (currency) {
    //                             setCurrencies([
    //                                 ...currencies,
    //                                 currency.toUpperCase(),
    //                             ]);
    //                         }
    //                     }}
    //                 >
    //                     +
    //                 </div>
    //             </div>
    //         </div>

    //         <Keypad callback={keypadPress} />
    //     </div>
    // );
}

export default App;
