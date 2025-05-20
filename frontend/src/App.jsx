import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Load from localStorage on first load
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const ws = new WebSocket('wss://neo-backend-kb45.onrender.com'); // Replace with your backend URL
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setData((prev) => {
        const filtered = prev.filter((x) => x.symbol !== msg.symbol);
        return [msg, ...filtered].slice(0, 10); // limit to 10 entries
      });
    };
    return () => ws.close();
  }, []);

  const toggleFavorite = (symbol) => {
    let updated;
    if (favorites.includes(symbol)) {
      updated = favorites.filter((s) => s !== symbol);
    } else {
      updated = [...favorites, symbol];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (symbol) => favorites.includes(symbol);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>📈 Live Option Tracker</h1>

      <h2>🟢 Live Options</h2>
      {data.map((item, idx) => (
        <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
          <strong>{item.symbol}</strong>: ₹{item.ltp}
          <button
            onClick={() => toggleFavorite(item.symbol)}
            style={{
              float: 'right',
              color: isFavorite(item.symbol) ? 'gold' : 'gray',
              fontSize: '1.2rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            title={isFavorite(item.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            ★
          </button>
        </div>
      ))}

      {favorites.length > 0 && (
        <>
          <h2>⭐ Your Watchlist</h2>
          {favorites.map((symbol, idx) => {
            const item = data.find((d) => d.symbol === symbol);
            return (
              <div key={idx} style={{ borderBottom: '1px dashed #aaa', padding: '0.5rem 0' }}>
                <strong>{symbol}</strong>: ₹{item?.ltp ?? 'Loading...'}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default App;
