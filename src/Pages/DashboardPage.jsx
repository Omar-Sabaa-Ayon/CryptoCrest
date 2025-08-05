import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';  
import {  
  LineChart,  
  Line,  
  BarChart,  
  Bar,  
  XAxis,  
  YAxis,  
  Tooltip,  
  ResponsiveContainer,  
} from 'recharts';  
import Select from 'react-select';  
import html2canvas from 'html2canvas';  
import { useNavigate } from 'react-router-dom'; // <-- Import for navigation  
  
// --------------------------------------------------------------------  
// Config  
// --------------------------------------------------------------------  
const GROUPED_PAIRS = [  
  {  
    label: 'Fiat Currencies',  
    options: [  
      { value: 'EURUSDT', label: 'Euro (EUR/USDT)' },  
      { value: 'GBPUSDT', label: 'British Pound (GBP/USDT)' },  
      { value: 'BUSDUSDT', label: 'Binance USD (BUSD/USDT)' },  
    ],  
  },  
  {  
    label: 'Top Cryptos',  
    options: [  
      { value: 'BTCUSDT', label: 'Bitcoin (BTC/USDT)' },  
      { value: 'ETHUSDT', label: 'Ethereum (ETH/USDT)' },  
      { value: 'BNBUSDT', label: 'BNB (BNB/USDT)' },  
    ],  
  },  
  {  
    label: 'Altcoins',  
    options: [  
      { value: 'SOLUSDT', label: 'Solana (SOL/USDT)' },  
      { value: 'MATICUSDT', label: 'Polygon (MATIC/USDT)' },  
      { value: 'DOGEUSDT', label: 'Dogecoin (DOGE/USDT)' },  
      { value: 'SHIBUSDT', label: 'Shiba Inu (SHIB/USDT)' },  
      { value: 'XRPUSDT', label: 'XRP (XRP/USDT)' },  
      { value: 'ADAUSDT', label: 'Cardano (ADA/USDT)' },  
      { value: 'DOTUSDT', label: 'Polkadot (DOT/USDT)' },  
      { value: 'AVAXUSDT', label: 'Avalanche (AVAX/USDT)' },  
      { value: 'LTCUSDT', label: 'Litecoin (LTC/USDT)' },  
      { value: 'UNIUSDT', label: 'Uniswap (UNI/USDT)' },  
      { value: 'LINKUSDT', label: 'Chainlink (LINK/USDT)' },  
      { value: 'ALGOUSDT', label: 'Algorand (ALGO/USDT)' },  
      { value: 'MANAUSDT', label: 'Decentraland (MANA/USDT)' },  
      { value: 'ATOMUSDT', label: 'Cosmos (ATOM/USDT)' },  
      { value: 'FTMUSDT', label: 'Fantom (FTM/USDT)' },  
      { value: 'EGLDUSDT', label: 'Elrond (EGLD/USDT)' },  
      { value: 'VETUSDT', label: 'VeChain (VET/USDT)' },  
      { value: 'THETAUSDT', label: 'Theta (THETA/USDT)' },  
      { value: 'SANDUSDT', label: 'The Sandbox (SAND/USDT)' },  
      { value: 'CROUSDT', label: 'Crypto.com Coin (CRO/USDT)' },  
      { value: 'AXSUSDT', label: 'Axie Infinity (AXS/USDT)' },  
      { value: 'ICPUSDT', label: 'Internet Computer (ICP/USDT)' },  
      { value: 'XTZUSDT', label: 'Tezos (XTZ/USDT)' },  
      { value: 'GRTUSDT', label: 'The Graph (GRT/USDT)' },  
      { value: 'NEARUSDT', label: 'NEAR Protocol (NEAR/USDT)' },  
      { value: 'ZILUSDT', label: 'Zilliqa (ZIL/USDT)' },  
      { value: 'KSMUSDT', label: 'Kusama (KSM/USDT)' },  
      { value: 'DASHUSDT', label: 'Dash (DASH/USDT)' },  
      { value: 'COMPUSDT', label: 'Compound (COMP/USDT)' },  
      { value: 'MKRUSDT', label: 'Maker (MKR/USDT)' },  
      { value: 'OMGUSDT', label: 'OMG Network (OMG/USDT)' },  
      { value: 'ZRXUSDT', label: '0x (ZRX/USDT)' },  
    ],  
  },  
];  
  
const BINANCE_API = 'https://api.binance.com/api/v3';  
const PRICE_INTERVAL = 5000;  
  
// --------------------------------------------------------------------  
// Helpers  
// --------------------------------------------------------------------  
function calculateSMA(data, period = 5) {  
  const sma = [];  
  for (let i = 0; i < data.length; i += 1) {  
    if (i < period - 1) {  
      sma.push(null);  
    } else {  
      const slice = data.slice(i - period + 1, i + 1);  
      const sum = slice.reduce((acc, val) => acc + val.close, 0);  
      sma.push(sum / period);  
    }  
  }  
  return sma;  
}  
  
function calculateEMA(data, period = 5) {  
  const ema = [];  
  const k = 2 / (period + 1);  
  let prevEma = null;  
  
  for (let i = 0; i < data.length; i += 1) {  
    const { close } = data[i];  
  
    if (i < period - 1) {  
      ema.push(null);  
    } else if (i === period - 1) {  
      const slice = data.slice(i - period + 1, i + 1);  
      const sum = slice.reduce((acc, val) => acc + val.close, 0);  
      prevEma = sum / period;  
      ema.push(prevEma);  
    } else {  
      prevEma = close * k + prevEma * (1 - k);  
      ema.push(prevEma);  
    }  
  }  
  return ema;  
}  
  
// --------------------------------------------------------------------  
// Main component  
// --------------------------------------------------------------------  
function DashboardPage() {  
  // ---------------- state ----------------  
  const [primary, setPrimary] = useState(GROUPED_PAIRS[1].options[0]);  
  const [compareMode, setCompareMode] = useState(false);  
  const [secondary, setSecondary] = useState(null);  
  
  const [primaryPrice, setPrimaryPrice] = useState(null);  
  const [secondaryPrice, setSecondaryPrice] = useState(null);  
  const [primaryHistory, setPrimaryHistory] = useState([]);  
  const [secondaryHistory, setSecondaryHistory] = useState([]);  
  
  const [candlestickMode, setCandlestickMode] = useState(false);  
  const [showSMA, setShowSMA] = useState(false);  
  const [showEMA, setShowEMA] = useState(false);  
  
  const [prediction, setPrediction] = useState('');  
  const [loadingPred, setLoadingPred] = useState(false);  
  
  const chartRef = useRef(null);  
  
  const navigate = useNavigate(); // Added navigation hook  
  
  // --- Logout handler ---  
  const handleLogout = () => {  
    localStorage.removeItem('token'); // Adjust if you use a different storage key  
    navigate('/login');  
  };  
  
  // ---------------- fetch helpers ----------------  
  const fetchPrice = useCallback(async (symbol) => {  
    const res = await fetch(`${BINANCE_API}/ticker/price?symbol=${symbol}`);  
    const json = await res.json();  
    return Number.parseFloat(json.price);  
  }, []);  
  
  const fetchHistory = useCallback(async (symbol) => {  
    const end = Date.now();  
    const start = end - 30 * 24 * 60 * 60 * 1000; // 30 days  
    const res = await fetch(  
      `${BINANCE_API}/klines?symbol=${symbol}&interval=1d&startTime=${start}&endTime=${end}&limit=30`  
    );  
    const json = await res.json();  
    return json.map((d) => ({  
      date: new Date(d[0]).toLocaleDateString(),  
      open: Number(d[1]),  
      high: Number(d[2]),  
      low: Number(d[3]),  
      close: Number(d[4]),  
    }));  
  }, []);  
  
  const loadPrimary = useCallback(async () => {  
    const [price, hist] = await Promise.all([  
      fetchPrice(primary.value),  
      fetchHistory(primary.value),  
    ]);  
    setPrimaryPrice(price);  
    setPrimaryHistory(hist);  
    setPrediction(''); // clear AI text on pair change  
  }, [primary, fetchPrice, fetchHistory]);  
  
  const loadSecondary = useCallback(async () => {  
    if (!compareMode || !secondary) {  
      setSecondaryPrice(null);  
      setSecondaryHistory([]);  
      return;  
    }  
    const [price, hist] = await Promise.all([  
      fetchPrice(secondary.value),  
      fetchHistory(secondary.value),  
    ]);  
    setSecondaryPrice(price);  
    setSecondaryHistory(hist);  
  }, [compareMode, secondary, fetchPrice, fetchHistory]);  
  
  // ---------------- effects ----------------  
  useEffect(() => {  
    loadPrimary();  
  }, [loadPrimary]);  
  
  useEffect(() => {  
    loadSecondary();  
  }, [loadSecondary]);  
  
  useEffect(() => {  
    const id = setInterval(() => fetchPrice(primary.value).then(setPrimaryPrice), PRICE_INTERVAL);  
    return () => clearInterval(id);  
  }, [primary, fetchPrice]);  
  
  useEffect(() => {  
    if (!compareMode || !secondary) return undefined;  
    const id = setInterval(() => fetchPrice(secondary.value).then(setSecondaryPrice), PRICE_INTERVAL);  
    return () => clearInterval(id);  
  }, [compareMode, secondary, fetchPrice]);  
  
  // ---------------- AI prediction ----------------  
  const fetchPrediction = useCallback(async (history) => {  
    try {  
      const res = await fetch('http://localhost:5000/api/predict', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({ history }),  
      });  
      if (!res.ok) throw new Error('Network response was not ok');  
      const json = await res.json();  
      return json.prediction;  
    } catch (e) {  
      console.error('Prediction fetch error:', e);  
      return null;  
    }  
  }, []);  
  
  // ---------------- derived data ----------------  
  const enrichedPrimary = useMemo(() => {  
    if (!primaryHistory.length) return [];  
    const sma = calculateSMA(primaryHistory);  
    const ema = calculateEMA(primaryHistory);  
    return primaryHistory.map((p, i) => ({ ...p, sma: sma[i], ema: ema[i] }));  
  }, [primaryHistory]);  
  
  const enrichedSecondary = useMemo(() => {  
    if (!secondaryHistory.length) return [];  
    const sma = calculateSMA(secondaryHistory);  
    const ema = calculateEMA(secondaryHistory);  
    return secondaryHistory.map((p, i) => ({ ...p, sma: sma[i], ema: ema[i] }));  
  }, [secondaryHistory]);  
  
  // ---------------- UI helpers ----------------  
  const Meta = ({ label, value }) => (  
    <div style={{ marginBottom: 4 }}>  
      <strong>{label}:&nbsp;</strong>  
      {value ?? 'N/A'}  
    </div>  
  );  
  
  // ---------------- render ----------------  
  return (
  <div
    style={{
      minHeight: '100vh',
      background: '#0f1c2e',
      color: '#349f',
      padding: 24,
      position: 'relative', // Added to support absolute logout button
    }}
  >
    {/* Logout Button */}
    <button
      type="button"
      onClick={handleLogout}
      className="hover-grow"
      style={{
        position: 'absolute',
        top: 30,
        right: 30,
        padding: '10px 40px 12px 20px', // add extra right padding for icon space
        borderRadius: 18,
        border: 'none',
        background: '#d9534f',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        zIndex: 1000,
        backgroundImage: "url('/icons/icons8-logout-50.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center', // position icon on right with some padding
        backgroundSize: '20px 20px', // size of the icon
      }}
    >
      Logout
    </button>

    <div
      style={{
        maxWidth: 2000,
        margin: '0 auto', // <-- Fixed margin to center container
        background: '#1b2b3f',
        borderRadius: 20,
        padding: 24,
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>📈 Crypto Dashboard</h1>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <Select
          options={GROUPED_PAIRS}
          value={primary}
          onChange={setPrimary}
          isSearchable
          styles={{ control: (b) => ({ ...b, borderRadius: 18, minWidth: 250 }) }}
        />
        <button
          type="button"
          onClick={() => {
            setCompareMode((v) => !v);
            setSecondary(null);
          }}
          className="hover-grow"
          style={{
            padding: '10px 20px',
            borderRadius: 18,
            border: 'none',
            background: compareMode ? '#ff5555' : '#2b72ff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {compareMode ? 'Cancel Compare' : 'Compare'}
        </button>
        <button
          type="button"
          onClick={() => setCandlestickMode((v) => !v)}
          className="hover-grow"
          style={{
            padding: '10px 20px',
            borderRadius: 18,
            border: 'none',
            background: candlestickMode ? '#ffb347' : '#2b72ff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {candlestickMode ? 'Line Chart' : 'Candlestick'}
        </button>
        <button
          type="button"
          onClick={() => setShowSMA((v) => !v)}
          className="hover-grow"
          style={{
            padding: '10px 20px',
            borderRadius: 18,
            border: 'none',
            background: showSMA ? '#4caf50' : '#555',
            color: '#fff',
            cursor: 'pointer',
            width: 80,
          }}
        >
          SMA
        </button>
        <button
          type="button"
          onClick={() => setShowEMA((v) => !v)}
          className="hover-grow"
          style={{
            padding: '10px 20px',
            borderRadius: 18,
            border: 'none',
            background: showEMA ? '#ffb347' : '#555',
            color: '#fff',
            cursor: 'pointer',
            width: 80,
          }}
        >
          EMA
        </button>

        {compareMode && (
          <Select
            options={GROUPED_PAIRS}
            value={secondary}
            onChange={setSecondary}
            isSearchable
            placeholder="Select pair to compare"
            styles={{ control: (b) => ({ ...b, borderRadius: 18, minWidth: 250 }) }}
          />
        )}

        {/* Export PNG button */}
        <button
          type="button"
          onClick={() => {
            if (!chartRef.current) return;
            html2canvas(chartRef.current).then((canvas) => {
              const link = document.createElement('a');
              link.download = `${primary.value}-chart.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
            });
          }}
          className="hover-grow"
          style={{
            marginLeft: 'auto',
            padding: '10px 20px',
            borderRadius: 18,
            border: 'none',
            background: '#00aaff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Export Chart PNG
        </button>

        {/* News button */}
        <button
          type="button"
          onClick={() => navigate('/news')}
          className="hover-grow"
          style={{
            padding: '10px 20px',
            borderRadius: 18,
            border: 'none',
            background: '#28a745',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          News
        </button>

        {/* Trade button */}
        <button
          type="button"
          onClick={() => navigate('/trade')}
          className="hover-grow"
          style={{
            padding: '10px 20px',
            borderRadius: 18,
            border: 'none',
            background: '#ff5722',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Trade Now
        </button>
      </div>

      {/* Charts */}
      <div ref={chartRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {/* Primary chart */}
        <div style={{ flex: 1, minWidth: 400, background: '#0b1a2a', borderRadius: 20, padding: 16 }}>
          <h2>
            {primary.label} {primaryPrice ? `- $${primaryPrice.toFixed(4)}` : ''}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            {candlestickMode ? (
              <BarChart data={primaryHistory}>
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Bar dataKey="close" fill="#349f" />
              </BarChart>
            ) : (
              <LineChart data={enrichedPrimary}>
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#349f" dot={false} />
                {showSMA && <Line type="monotone" dataKey="sma" stroke="#4caf50" dot={false} />}
                {showEMA && <Line type="monotone" dataKey="ema" stroke="#ffb347" dot={false} />}
              </LineChart>
            )}
          </ResponsiveContainer>
          <div style={{ marginTop: 12 }}>
            <Meta label="Latest Close" value={primaryPrice ? `$${primaryPrice.toFixed(4)}` : 'N/A'} />
            <Meta
              label="Change (24h)"
              value={
                primaryHistory.length > 1
                  ? `${(
                      ((primaryPrice - primaryHistory[primaryHistory.length - 2].close) /
                        primaryHistory[primaryHistory.length - 2].close) *
                      100
                    ).toFixed(2)}%`
                  : 'N/A'
              }
            />
          </div>
        </div>

        {/* Secondary chart (compare mode) */}
        {compareMode && secondary && (
          <div style={{ flex: 1, minWidth: 400, background: '#0b1a2a', borderRadius: 20, padding: 16 }}>
            <h2>
              {secondary.label} {secondaryPrice ? `- $${secondaryPrice.toFixed(4)}` : ''}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              {candlestickMode ? (
                <BarChart data={secondaryHistory}>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Bar dataKey="close" fill="#f44336" />
                </BarChart>
              ) : (
                <LineChart data={enrichedSecondary}>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" stroke="#f44336" dot={false} />
                  {showSMA && <Line type="monotone" dataKey="sma" stroke="#4caf50" dot={false} />}
                  {showEMA && <Line type="monotone" dataKey="ema" stroke="#ffb347" dot={false} />}
                </LineChart>
              )}
            </ResponsiveContainer>
            <div style={{ marginTop: 12 }}>
              <Meta label="Latest Close" value={secondaryPrice ? `$${secondaryPrice.toFixed(4)}` : 'N/A'} />
              <Meta
                label="Change (24h)"
                value={
                  secondaryHistory.length > 1
                    ? `${(
                        ((secondaryPrice - secondaryHistory[secondaryHistory.length - 2].close) /
                          secondaryHistory[secondaryHistory.length - 2].close) *
                        100
                      ).toFixed(2)}%`
                    : 'N/A'
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* AI Prediction Section */}
      <div style={{ marginTop: 24 }}>
        <button
          type="button"
          onClick={async () => {
            setLoadingPred(true);
            const pred = await fetchPrediction(primaryHistory);
            setPrediction(pred ?? 'Failed to fetch prediction');
            setLoadingPred(false);
          }}
          className="hover-grow"
          style={{
            padding: '10px 30px',
            borderRadius: 18,
            border: 'none',
            background: '#5c6bc0',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: 12,
          }}
        >
          {loadingPred ? 'Predicting...' : 'Get AI Prediction'}
        </button>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            background: '#192a4a',
            borderRadius: 12,
            padding: 16,
            minHeight: 80,
            fontSize: 16,
            color: '#ddd',
          }}
        >
          {prediction}
        </div>
      </div>
    </div>
  </div>
);
}

export default DashboardPage;
