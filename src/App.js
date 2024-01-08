import React from "react";
import logo from "./logo.svg";
import "./App.css";

const URL = "https://open.er-api.com/v6/latest/";

function App() {
    const [baseCurrency, setBaseCurrency] = React.useState("USD");
    const [baseValue, setBaseValue] = React.useState(1);
    const [currencies, setCurrencies] = React.useState([baseCurrency]);

    const [rates, setRates] = React.useState();
    const [updated, setUpdated] = React.useState();

    React.useEffect(() => {
        fetch(URL + baseCurrency)
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
                    Last updated: {updated ? updated.toISOString() : "Never"}
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
                                setCurrencies([...currencies, currency]);
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
