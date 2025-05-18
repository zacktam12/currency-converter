import { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("EUR");
  const [converted, setConverted] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function converter() {
      setIsLoading(true);
      setError(null); // Clear previous error
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setConverted(data.rates[toCur]);
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setIsLoading(false); // Ensure loading state is updated
      }
    }

    if (fromCur === toCur) {
      setConverted(amount);
    } else {
      converter();
    }
  }, [amount, fromCur, toCur]);

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="app-container">
      <input
        type="text"
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
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        className="currency-selector to-currency"
        value={toCur}
        onChange={(e) => setToCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="ETB">INR</option>
      </select>
      <p className="conversion-result">
        {isLoading ? (
          <span className="loading-text">Loading...</span>
        ) : (
          `${converted} ${toCur}`
        )}
      </p>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
