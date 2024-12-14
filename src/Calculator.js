import React, { useState, useEffect } from "react";
import "./Calculator.css";

const Calculator = () => {
  const [query, setQuery] = useState("0");
  const [result, setResult] = useState(null);

  // Initialize history and memory from localStorage
  const [history, setHistory] = useState(() => {
    const storedHistory = localStorage.getItem("calculatorHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const [memory, setMemory] = useState(() => {
    const storedMemory = localStorage.getItem("calculatorMemory");
    return storedMemory ? JSON.parse(storedMemory) : [];
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  // Update localStorage when history changes
  useEffect(() => {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
  }, [history]);

  // Update localStorage when memory changes
  useEffect(() => {
    localStorage.setItem("calculatorMemory", JSON.stringify(memory));
  }, [memory]);

  const handleInput = (value) => {
    if (query === "0" && !isNaN(value)) {
      setQuery(value);
    } else {
      setQuery(query + value);
    }
  };

  const handleClearAll = () => {
    setQuery("0");
    setResult(null);
  };

  const handleClearEnd = () => {
    const lastOperatorIndex = Math.max(
      query.lastIndexOf("+"),
      query.lastIndexOf("-"),
      query.lastIndexOf("*"),
      query.lastIndexOf("/")
    );
    setQuery(query.substring(0, lastOperatorIndex + 1) || "0");
  };

  const handleBackspace = () => {
    setQuery(query.length > 1 ? query.slice(0, -1) : "0");
  };

  const evaluateResult = () => {
    try {
      const calculatedResult = Function(`return ${query}`)();
      setResult(calculatedResult);
      setHistory([...history, { query, result: calculatedResult }]);
    } catch {
      setResult("Error");
    }
  };

  const handleMemoryStore = () => {
    if (result !== null) {
      setMemory([...memory, result]);
    }
  };

  const handleMemoryRecall = () => {
    if (memory.length > 0) {
      setQuery(memory[memory.length - 1].toString());
    }
  };

  const handleMemoryAdd = () => {
    if (result !== null) {
      const lastValue = memory[memory.length - 1] || 0;
      setMemory([...memory.slice(0, -1), lastValue + result]);
    }
  };

  const handleMemorySubtract = () => {
    if (result !== null) {
      const lastValue = memory[memory.length - 1] || 0;
      setMemory([...memory.slice(0, -1), lastValue - result]);
    }
  };

  const handleMemoryClear = () => {
    setMemory([]);
  };

  const togglePanel = (panel) => {
    if (panel === "history") {
      setShowHistory(!showHistory);
      setShowMemory(false);
    } else if (panel === "memory") {
      setShowMemory(!showMemory);
      setShowHistory(false);
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <div className="query">{query}</div>
          <div className="result">{result !== null ? result : ""}</div>
        </div>
        <div className="keys">
          <button onClick={handleClearAll}>C</button>
          <button onClick={handleClearEnd}>CE</button>
          <button onClick={handleBackspace}>Back</button>
          <button onClick={() => handleInput("/")}>/</button>
          {[7, 8, 9].map((num) => (
            <button key={num} onClick={() => handleInput(num)}>
              {num}
            </button>
          ))}
          <button onClick={() => handleInput("*")}>*</button>
          {[4, 5, 6].map((num) => (
            <button key={num} onClick={() => handleInput(num)}>
              {num}
            </button>
          ))}
          <button onClick={() => handleInput("-")}>-</button>
          {[1, 2, 3].map((num) => (
            <button key={num} onClick={() => handleInput(num)}>
              {num}
            </button>
          ))}
          <button onClick={() => handleInput("+")}>+</button>
          <button onClick={() => handleInput(0)}>0</button>
          <button onClick={() => handleInput(".")}>.</button>
          <button onClick={evaluateResult}>=</button>
        </div>
        <div className="memory-keys">
          <button onClick={handleMemoryClear}>MC</button>
          <button onClick={handleMemoryRecall}>MR</button>
          <button onClick={handleMemoryAdd}>M+</button>
          <button onClick={handleMemorySubtract}>M-</button>
          <button onClick={handleMemoryStore}>MS</button>
        </div>
      </div>
      <div className="sidebar">
        <button
          className="toggle-button"
          onClick={() => togglePanel("history")}
        >
          ☰ History
        </button>
        <button className="toggle-button" onClick={() => togglePanel("memory")}>
          ☰ Memory
        </button>
      </div>
      {showHistory && (
        <div className="panel history-panel">
          <h3>History</h3>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {entry.query} = {entry.result}
              </li>
            ))}
          </ul>
          <button onClick={() => setHistory([])}>Clear History</button>
        </div>
      )}
      {showMemory && (
        <div className="panel memory-panel">
          <h3>Memory</h3>
          <ul>
            {memory.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
          <button onClick={handleMemoryClear}>Clear Memory</button>
        </div>
      )}
    </div>
  );
};

export default Calculator;
