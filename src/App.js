import React from "react";
import { getEmojiByCurrencyCode } from "country-currency-emoji-flags";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { usePersistedState } from "./usePersistedState.js";
import Keypad from "./Keypad";

import "./App.css";

const URL = "https://open.er-api.com/v6/latest/";
const BASE = "USD";

function SortableCurrencyRow({ currency, isBase, value, onActivate, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: currency });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div className="py-1" ref={setNodeRef} style={style}>
            <div
                className={`flex items-center p-2 w-full cursor-pointer overflow-hidden ${
                    isBase ? "border-2 border-blue-800 rounded-md" : ""
                }`}
                onClick={onActivate}
            >
                <span
                    className="touch-none cursor-grab text-slate-300 mr-2 select-none"
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()}
                >
                    ⠿
                </span>
                <strong className="shrink-0 text-left">
                    {getEmojiByCurrencyCode(currency)} {currency}
                </strong>
                <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                    <span className="whitespace-nowrap overflow-hidden">{value}</span>
                    <span
                        className="shrink-0 text-slate-400 hover:text-red-500 text-xl leading-none"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        ×
                    </span>
                </div>
            </div>
        </div>
    );
}

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
                setUpdated(new Date().toISOString());
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
            const next = baseValue + value;
            const digits = next.replace(/[^0-9]/g, "");
            if (digits.length > 12) return;
            setBaseValue(next);
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = currencies.indexOf(active.id);
            const newIndex = currencies.indexOf(over.id);
            setCurrencies(arrayMove(currencies, oldIndex, newIndex));
        }
    }

    return (
        <div className="flex flex-col h-screen justify-between bg-gray-800 text-white p-4">
            <main className="mb-auto text-center overflow-scroll">
                <div className="text-sm font-light">
                    Rates updated: {updated ? new Date(updated).toLocaleString() : "Never"}
                </div>
                <div className="mx-auto w-full">
                    <div
                        id="latest_rates_display"
                        className="my-5 w-full bg-white shadow rounded-md px-5 py-3 text-3xl empty:hidden text-black"
                    >
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={currencies} strategy={verticalListSortingStrategy}>
                                {currencies.map((currency) => (
                                    <SortableCurrencyRow
                                        key={currency}
                                        currency={currency}
                                        isBase={currency === baseCurrency}
                                        value={
                                            currency !== baseCurrency
                                                ? processCurrency(currency).toLocaleString(undefined, { maximumFractionDigits: 2 })
                                                : baseValue !== "0"
                                                ? parseFloat(baseValue).toLocaleString(undefined, { maximumFractionDigits: 2 })
                                                : " "
                                        }
                                        onActivate={() => {
                                            setBaseValue("0");
                                            setBaseCurrency(currency);
                                        }}
                                        onDelete={() =>
                                            setCurrencies(currencies.filter((c) => c !== currency))
                                        }
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
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
            <footer className="pt-4">
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
