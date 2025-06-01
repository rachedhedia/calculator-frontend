import React, { useState } from 'react';
import './App.css';

function App() {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculate = async (operation: string) => {
    setError('');
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://calculator-backend-fkj3.onrender.com';
      console.log('Making request to:', `${apiUrl}/api/calculate`);
      
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
        console.error('Server returned error:', data.error);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError('Failed to perform calculation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculator App</h1>
        <div className="calculator">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            placeholder="Enter first number"
            disabled={loading}
          />
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Enter second number"
            disabled={loading}
          />
          <div className="buttons">
            <button onClick={() => handleCalculate('add')} disabled={loading}>Add</button>
            <button onClick={() => handleCalculate('subtract')} disabled={loading}>Subtract</button>
            <button onClick={() => handleCalculate('multiply')} disabled={loading}>Multiply</button>
            <button onClick={() => handleCalculate('divide')} disabled={loading}>Divide</button>
          </div>
          {loading && <div className="loading">Calculating...</div>}
          {error && <div className="error">{error}</div>}
          {result !== null && <div className="result">Result: {result}</div>}
        </div>
      </header>
    </div>
  );
}

export default App;
