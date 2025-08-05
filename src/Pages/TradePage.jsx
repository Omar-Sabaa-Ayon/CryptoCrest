import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from "recharts";
import { useNavigate } from "react-router-dom";

const BINANCE_API = "https://api.binance.com/api/v3";
const START_BALANCE = 100000;

// ✅ Full asset list restored
const GROUPED_PAIRS = [
  {
    label: "Fiat Currencies",
    options: [
      { value: "EURUSDT", label: "Euro (EUR/USDT)" },
      { value: "GBPUSDT", label: "British Pound (GBP/USDT)" },
      { value: "BUSDUSDT", label: "Binance USD (BUSD/USDT)" },
    ],
  },
  {
    label: "Top Cryptos",
    options: [
      { value: "BTCUSDT", label: "Bitcoin (BTC/USDT)" },
      { value: "ETHUSDT", label: "Ethereum (ETH/USDT)" },
      { value: "BNBUSDT", label: "BNB (BNB/USDT)" },
    ],
  },
  {
    label: "Altcoins",
    options: [
      { value: "SOLUSDT", label: "Solana (SOL/USDT)" },
      { value: "MATICUSDT", label: "Polygon (MATIC/USDT)" },
      { value: "DOGEUSDT", label: "Dogecoin (DOGE/USDT)" },
      { value: "SHIBUSDT", label: "Shiba Inu (SHIB/USDT)" },
      { value: "XRPUSDT", label: "XRP (XRP/USDT)" },
      { value: "ADAUSDT", label: "Cardano (ADA/USDT)" },
      { value: "DOTUSDT", label: "Polkadot (DOT/USDT)" },
      { value: "AVAXUSDT", label: "Avalanche (AVAX/USDT)" },
      { value: "LTCUSDT", label: "Litecoin (LTC/USDT)" },
      { value: "UNIUSDT", label: "Uniswap (UNI/USDT)" },
      { value: "LINKUSDT", label: "Chainlink (LINK/USDT)" },
      { value: "ALGOUSDT", label: "Algorand (ALGO/USDT)" },
      { value: "MANAUSDT", label: "Decentraland (MANA/USDT)" },
      { value: "ATOMUSDT", label: "Cosmos (ATOM/USDT)" },
      { value: "FTMUSDT", label: "Fantom (FTM/USDT)" },
      { value: "EGLDUSDT", label: "Elrond (EGLD/USDT)" },
      { value: "VETUSDT", label: "VeChain (VET/USDT)" },
      { value: "THETAUSDT", label: "Theta (THETA/USDT)" },
      { value: "SANDUSDT", label: "The Sandbox (SAND/USDT)" },
      { value: "CROUSDT", label: "Crypto.com Coin (CRO/USDT)" },
      { value: "AXSUSDT", label: "Axie Infinity (AXS/USDT)" },
      { value: "ICPUSDT", label: "Internet Computer (ICP/USDT)" },
      { value: "XTZUSDT", label: "Tezos (XTZ/USDT)" },
      { value: "GRTUSDT", label: "The Graph (GRT/USDT)" },
      { value: "NEARUSDT", label: "NEAR Protocol (NEAR/USDT)" },
      { value: "ZILUSDT", label: "Zilliqa (ZIL/USDT)" },
      { value: "KSMUSDT", label: "Kusama (KSM/USDT)" },
      { value: "DASHUSDT", label: "Dash (DASH/USDT)" },
      { value: "COMPUSDT", label: "Compound (COMP/USDT)" },
      { value: "MKRUSDT", label: "Maker (MKR/USDT)" },
      { value: "OMGUSDT", label: "OMG Network (OMG/USDT)" },
      { value: "ZRXUSDT", label: "0x (ZRX/USDT)" },
    ],
  },
];

export default function TradePage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(START_BALANCE);
  const [holdings, setHoldings] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("BTCUSDT");
  const [tradeAmount, setTradeAmount] = useState("");
  const [prices, setPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState([]);
  const [trades, setTrades] = useState([]);

  // ✅ Load saved data
  useEffect(() => {
    setBalance(parseFloat(localStorage.getItem("mock_balance")) || START_BALANCE);
    setHoldings(JSON.parse(localStorage.getItem("mock_holdings")) || []);
    setTrades(JSON.parse(localStorage.getItem("mock_trades")) || []);
  }, []);

  // ✅ Save data
  useEffect(() => {
    localStorage.setItem("mock_balance", balance);
    localStorage.setItem("mock_holdings", JSON.stringify(holdings));
    localStorage.setItem("mock_trades", JSON.stringify(trades));
  }, [balance, holdings, trades]);

  // ✅ Fetch price & history
  useEffect(() => {
    if (!selectedAsset) return;
    const fetchData = async () => {
      try {
        const priceRes = await fetch(`${BINANCE_API}/ticker/price?symbol=${selectedAsset}`);
        const priceData = await priceRes.json();
        setPrices((prev) => ({ ...prev, [selectedAsset]: parseFloat(priceData.price) }));

        const end = Date.now();
        const start = end - 24 * 60 * 60 * 1000;
        const histRes = await fetch(
          `${BINANCE_API}/klines?symbol=${selectedAsset}&interval=15m&startTime=${start}&endTime=${end}&limit=96`
        );
        const histJson = await histRes.json();
        setPriceHistory(
          histJson.map((d) => ({
            time: new Date(d[0]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            price: parseFloat(d[4]),
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, [selectedAsset]);

  // ✅ Execute trade
  const executeTrade = (type) => {
    const amount = parseFloat(tradeAmount);
    const price = prices[selectedAsset];
    if (!amount || amount <= 0) return alert("Invalid amount!");
    if (type === "buy") {
      const cost = amount * price;
      if (cost > balance) return alert("Insufficient balance!");
      setBalance(balance - cost);
      const existing = holdings.find((h) => h.symbol === selectedAsset);
      setHoldings(
        existing
          ? holdings.map((h) =>
              h.symbol === selectedAsset
                ? { ...h, amount: h.amount + amount, avgPrice: (h.amount * h.avgPrice + amount * price) / (h.amount + amount) }
                : h
            )
          : [...holdings, { symbol: selectedAsset, amount, avgPrice: price }]
      );
    } else {
      const existing = holdings.find((h) => h.symbol === selectedAsset);
      if (!existing || existing.amount < amount) return alert("Not enough holdings!");
      setBalance(balance + amount * price);
      setHoldings(
        existing.amount > amount
          ? holdings.map((h) => (h.symbol === selectedAsset ? { ...h, amount: h.amount - amount } : h))
          : holdings.filter((h) => h.symbol !== selectedAsset)
      );
    }
    setTrades([...trades, { type, symbol: selectedAsset, amount, price, time: new Date().toISOString() }]);
    setTradeAmount("");
  };

  // ✅ Reset portfolio
  const resetPortfolio = () => {
    if (!window.confirm("Reset portfolio to $100,000?")) return;
    setBalance(START_BALANCE);
    setHoldings([]);
    setTrades([]);
    localStorage.clear();
  };

  // ✅ Calculate P/L
  const totalPL = holdings.reduce((acc, h) => {
    const currentPrice = prices[h.symbol] || h.avgPrice;
    return acc + (currentPrice - h.avgPrice) * h.amount;
  }, 0);

  // ✅ Trade markers (unchanged)
  const tradeMarkers = trades.filter((t) => t.symbol === selectedAsset).map((t) => {
    let closest = priceHistory[0]?.time;
    let minDiff = Infinity;
    priceHistory.forEach((p) => {
      const diff = Math.abs(new Date(t.time).getTime() - new Date(`1970-01-01T${p.time}`).getTime());
      if (diff < minDiff) { minDiff = diff; closest = p.time; }
    });
    return { time: closest, price: t.price, type: t.type };
  });

  const renderTradeMarker = ({ cx, cy, payload }) => {
    if (cx == null || cy == null) return null;
    const color = payload.type === "buy" ? "#4caf50" : "#ff5555";
    return <svg x={cx - 8} y={cy - 8} width={16} height={16}><circle cx="8" cy="8" r="6" fill={color} stroke="#fff" strokeWidth="2" /></svg>;
  };

  // ✅ Button style with hover effect
  const btnStyle = (bg) => ({
    background: bg,
    padding: 12,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
    transition: "transform 0.2s ease, background 0.2s ease",
  });

  const btnHover = (e, bgHover) => { e.target.style.transform = "scale(1.05)"; e.target.style.background = bgHover; };
  const btnLeave = (e, bg) => { e.target.style.transform = "scale(1)"; e.target.style.background = bg; };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1c2e", color: "#ddd", padding: 30 }}>
      <div style={{ maxWidth: 1400, margin: "auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>

        {/* Left Panel */}
        <div style={{ background: "#1b2b3f", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
          <h1 style={{ textAlign: "center", color: "#fff" }}>💹 Trading Simulator</h1>
          <p style={{ textAlign: "center", fontSize: 18 }}>
            <strong>Balance:</strong> ${balance.toLocaleString()} <br/>
            <strong>Total P/L:</strong> <span style={{ color: totalPL >= 0 ? "#4caf50" : "#ff5555" }}>{totalPL.toFixed(2)}</span>
          </p>

          <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)} style={{ padding: 10, borderRadius: 8, margin: "10px 0" }}>
            {GROUPED_PAIRS.map((group) => (
              <optgroup label={group.label} key={group.label}>
                {group.options.map(({ value, label }) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </optgroup>
            ))}
          </select>

          <input type="number" placeholder="Amount" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} style={{ padding: 10, borderRadius: 8, marginBottom: 10 }} />

          <button onMouseEnter={(e) => btnHover(e, "#6fdc7d")} onMouseLeave={(e) => btnLeave(e, "#4caf50")} onClick={() => executeTrade("buy")} style={btnStyle("#4caf50")}>Buy</button>
          <button onMouseEnter={(e) => btnHover(e, "#ff7878")} onMouseLeave={(e) => btnLeave(e, "#ff5555")} onClick={() => executeTrade("sell")} style={btnStyle("#ff5555")}>Sell</button>
          <button onMouseEnter={(e) => btnHover(e, "#ffb84d")} onMouseLeave={(e) => btnLeave(e, "#ff9800")} onClick={resetPortfolio} style={btnStyle("#ff9800")}>Reset Portfolio</button>
          <button onMouseEnter={(e) => btnHover(e, "#a29bff")} onMouseLeave={(e) => btnLeave(e, "#8884d8")} onClick={() => navigate("/dashboard")} style={btnStyle("#8884d8")}>⬅ Back to Dashboard</button>

          <h3 style={{ marginTop: 20, textAlign: "center" }}>📦 Holdings</h3>
          <div style={{ maxHeight: 120, overflowY: "auto" }}>
            {holdings.length === 0 ? <p>No holdings yet.</p> : holdings.map((h, i) => {
              const currentPrice = prices[h.symbol] || h.avgPrice;
              const pl = (currentPrice - h.avgPrice) * h.amount;
              return (
                <div key={i} style={{ background: "#223355", padding: 8, borderRadius: 6, marginBottom: 5 }}>
                  {h.symbol}: {h.amount} @ ${h.avgPrice.toFixed(2)} | P/L: <span style={{ color: pl >= 0 ? "#4caf50" : "#ff5555" }}>{pl.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <h3 style={{ marginTop: 20, textAlign: "center" }}>📜 Trade History</h3>
          <div style={{ maxHeight: 150, overflowY: "auto" }}>
            {trades.length === 0 ? <p>No trades yet.</p> : trades.map((t, i) => (
              <div key={i} style={{ background: "#223355", padding: 6, borderRadius: 6, marginBottom: 4 }}>
                [{new Date(t.time).toLocaleString()}] <span style={{ color: t.type === "buy" ? "#4caf50" : "#ff5555" }}>{t.type.toUpperCase()}</span> {t.amount} {t.symbol} @ ${t.price.toFixed(2)}
              </div>
            ))}
          </div>
        </div>

        {/* Right Chart */}
        <div style={{ background: "#1b2b3f", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
          <h2 style={{ textAlign: "center" }}>{selectedAsset} Price Chart</h2>
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: "bold", color: "#4cafef", marginBottom: 10, background: "#0f1c2e", border: "1px solid #2b72ff", borderRadius: 8, padding: 10, alignSelf: "center" }}>
            💲 Live {selectedAsset} Price: <span style={{ color: "#fff", marginLeft: 8 }}>{prices[selectedAsset] ? `$${prices[selectedAsset].toFixed(4)}` : "Loading..."}</span>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceHistory}>
              <XAxis dataKey="time" stroke="#ccc" interval={10} />
              <YAxis stroke="#ccc" domain={["dataMin - dataMin * 0.01", "dataMax + dataMax * 0.01"]} />
              <Tooltip formatter={(v, n) => (n === "price" ? `$${v.toFixed(2)}` : v)} labelFormatter={(l) => `Time: ${l}`} contentStyle={{ backgroundColor: "#223355", borderRadius: 8, border: "none" }} itemStyle={{ color: "#eee" }} labelStyle={{ color: "#aaa" }} />
              <Line type="monotone" dataKey="price" stroke="#2b72ff" dot={false} strokeWidth={2} strokeLinecap="round" />
              <Scatter data={tradeMarkers} shape={renderTradeMarker} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
