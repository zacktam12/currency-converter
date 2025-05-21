import { useEffect, useState } from "react";
import "./index.css";

const CURRENCIES = ["USD", "EUR", "CAD", "INR", "ETB", "GBP", "JPY"];

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("EUR");
  const [converted, setConverted] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function converter() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setConverted(data.rates[toCur]);
        setLastUpdated(data.date);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (fromCur === toCur) {
      setConverted(amount);
      setLastUpdated(new Date().toISOString().slice(0, 10));
    } else if (amount > 0) {
      converter();
    }
  }, [amount, fromCur, toCur]);

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) setAmount(value);
  };

  const handleSwap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
  };

  return (
    <div className="app-container">
      <input
        type="number"
        min="0"
        className="input-amount"
        value={amount}
        onChange={handleAmountChange}
        disabled={isLoading}
      />
      <select
        className="currency-selector from-currency"
        value={fromCur}
        onChange={(e) => setFromCur(e.target.value)}
      >
        {CURRENCIES.map((cur) => (
          <option key={cur} value={cur}>{cur}</option>
        ))}
      </select>
      <button className="swap-btn" onClick={handleSwap} disabled={isLoading}>
        ⇄
      </button>
      <select
        className="currency-selector to-currency"
        value={toCur}
        onChange={(e) => setToCur(e.target.value)}
        disabled={isLoading}
      >
        {CURRENCIES.map((cur) => (
          <option key={cur} value={cur}>{cur}</option>
        ))}
      </select>
      <p className="conversion-result">
        {isLoading ? (
          <span className="loading-text">Loading...</span>
        ) : (
          `${converted ?? ""} ${toCur}`
        )}
      </p>
      {lastUpdated && (
        <p className="last-updated">Last updated: {lastUpdated}</p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
