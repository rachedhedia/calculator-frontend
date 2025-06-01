import React, { useState } from 'react';
import './App.css';

function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleNumberInput = (num: string) => {
    if (waitingForSecondNumber) {
      setDisplayValue(num);
      setWaitingForSecondNumber(false);
    } else {
      setDisplayValue(displayValue === '0' ? num : displayValue + num);
    }
  };

  const handleDecimalPoint = () => {
    if (waitingForSecondNumber) {
      setDisplayValue('0.');
      setWaitingForSecondNumber(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleOperationClick = async (op: string) => {
    const currentValue = parseFloat(displayValue);

    if (firstNumber === null) {
      setFirstNumber(currentValue);
      setOperation(op);
      setWaitingForSecondNumber(true);
    } else if (waitingForSecondNumber) {
      setOperation(op);
    } else {
      try {
        setLoading(true);
        setError('');
        const apiUrl = process.env.REACT_APP_API_URL || 'https://calculator-backend-fkj3.onrender.com';
        
        const response = await fetch(`${apiUrl}/api/calculate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            num1: firstNumber,
            num2: currentValue,
            operation: operation,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setDisplayValue(data.result.toString());
          setFirstNumber(data.result);
          setOperation(op);
          setWaitingForSecondNumber(true);
        } else {
          setError(data.error || 'An error occurred');
          clearCalculator();
        }
      } catch (err) {
        setError('Failed to perform calculation. Please try again.');
        clearCalculator();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEquals = async () => {
    if (firstNumber !== null && operation && !waitingForSecondNumber) {
      const currentValue = parseFloat(displayValue);
      try {
        setLoading(true);
        setError('');
        const apiUrl = process.env.REACT_APP_API_URL || 'https://calculator-backend-fkj3.onrender.com';
        
        const response = await fetch(`${apiUrl}/api/calculate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            num1: firstNumber,
            num2: currentValue,
            operation: operation,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setDisplayValue(data.result.toString());
          setFirstNumber(null);
          setOperation(null);
          setWaitingForSecondNumber(false);
        } else {
          setError(data.error || 'An error occurred');
          clearCalculator();
        }
      } catch (err) {
        setError('Failed to perform calculation. Please try again.');
        clearCalculator();
      } finally {
        setLoading(false);
      }
    }
  };

  const clearCalculator = () => {
    setDisplayValue('0');
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(false);
    setError('');
  };

  const handlePlusMinusToggle = () => {
    setDisplayValue((parseFloat(displayValue) * -1).toString());
  };

  const handlePercentage = () => {
    setDisplayValue((parseFloat(displayValue) / 100).toString());
  };

  return (
    <div className="App">
      <div className="calculator">
        <div className="display">
          {loading ? 'Calculating...' : displayValue}
        </div>
        <div className="buttons">
          <button onClick={clearCalculator} data-function="true">AC</button>
          <button onClick={handlePlusMinusToggle} data-function="true">±</button>
          <button onClick={handlePercentage} data-function="true">%</button>
          <button onClick={() => handleOperationClick('divide')} data-operation="true">÷</button>
          
          <button onClick={() => handleNumberInput('7')} data-number="true">7</button>
          <button onClick={() => handleNumberInput('8')} data-number="true">8</button>
          <button onClick={() => handleNumberInput('9')} data-number="true">9</button>
          <button onClick={() => handleOperationClick('multiply')} data-operation="true">×</button>
          
          <button onClick={() => handleNumberInput('4')} data-number="true">4</button>
          <button onClick={() => handleNumberInput('5')} data-number="true">5</button>
          <button onClick={() => handleNumberInput('6')} data-number="true">6</button>
          <button onClick={() => handleOperationClick('subtract')} data-operation="true">−</button>
          
          <button onClick={() => handleNumberInput('1')} data-number="true">1</button>
          <button onClick={() => handleNumberInput('2')} data-number="true">2</button>
          <button onClick={() => handleNumberInput('3')} data-number="true">3</button>
          <button onClick={() => handleOperationClick('add')} data-operation="true">+</button>
          
          <button onClick={() => handleNumberInput('0')} data-number="true" className="zero">0</button>
          <button onClick={handleDecimalPoint} data-number="true">.</button>
          <button onClick={handleEquals} data-operation="true">=</button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;
