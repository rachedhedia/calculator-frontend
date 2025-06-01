import React, { useState } from 'react';
import './App.css';

function App() {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = async (operation: string) => {
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/calculate`, {
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
      setError('Failed to perform calculation');
      console.error('Error details:', err);
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
          />
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            placeholder="Enter second number"
          />
          <div className="buttons">
            <button onClick={() => handleCalculate('add')}>Add</button>
            <button onClick={() => handleCalculate('subtract')}>Subtract</button>
            <button onClick={() => handleCalculate('multiply')}>Multiply</button>
            <button onClick={() => handleCalculate('divide')}>Divide</button>
          </div>
          {error && <div className="error">{error}</div>}
          {result !== null && <div className="result">Result: {result}</div>}
        </div>
      </header>
    </div>
  );
}

export default App;
