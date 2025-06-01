import React, { useState } from 'react';
import './App.css';

function App() {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculate = async (operation: string) => {
    if (!num1 || !num2) {
      setError('Please enter both numbers');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://calculator-backend-fkj3.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num1: parseFloat(num1),
          num2: parseFloat(num2),
          operation,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to perform calculation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearCalculator = () => {
    setNum1('');
    setNum2('');
    setResult(null);
    setError('');
  };

  return (
    <div className="App">
      <div className="calculator">
        <div className="display">
          {result !== null ? result : (error ? '0' : num2 || num1 || '0')}
        </div>
        <div className="input-group">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="First number"
            disabled={loading}
          />
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Second number"
            disabled={loading}
          />
        </div>
        <div className="buttons">
          <button onClick={clearCalculator} data-number="true">C</button>
          <button onClick={() => handleCalculate('divide')} data-operation="true">÷</button>
          <button onClick={() => handleCalculate('multiply')} data-operation="true">×</button>
          <button onClick={() => handleCalculate('subtract')} data-operation="true">−</button>
          <button onClick={() => handleCalculate('add')} data-operation="true">+</button>
        </div>
        {loading && <div className="loading">Calculating...</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;
