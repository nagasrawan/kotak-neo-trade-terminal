import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000');
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setData(prev => [msg, ...prev.slice(0, 4)]);
    };
    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Kotak Neo Option Tracker</h2>
      {data.map((item, index) => (
        <div key={index}>
          {item.symbol}: ₹{item.ltp}
        </div>
      ))}
    </div>
  );
}

export default App;
