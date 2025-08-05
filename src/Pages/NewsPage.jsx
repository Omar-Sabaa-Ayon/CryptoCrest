import React, { useEffect, useState } from 'react';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [filterSource, setFilterSource] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/news');
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ✅ Apply filters: Source, Search, and Time Range
  const now = new Date();
  const filteredNews = news
    .filter((item) =>
      filterSource === 'all' ? true : item.source?.name === filterSource
    )
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) => {
      const published = new Date(item.publishedAt);
      if (timeFilter === '24h') return now - published <= 24 * 60 * 60 * 1000;
      if (timeFilter === 'week') return now - published <= 7 * 24 * 60 * 60 * 1000;
      if (timeFilter === 'month') return now - published <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });

  if (loading) return <p style={{ color: '#fff' }}>Loading latest news...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: 24,
        boxSizing: 'border-box',
        background: darkMode
          ? 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
          : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        color: darkMode ? '#fff' : '#222',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        position: 'relative',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Latest Crypto News</h1>

      {/* ✅ Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
        <button onClick={() => window.history.back()} style={btnStyle('#2b72ff')}>⬅ Back</button>
        <button onClick={fetchNews} style={btnStyle('#28a745')}>🔄 Refresh</button>
        <button onClick={() => setDarkMode((prev) => !prev)} style={btnStyle('#ff9800')}>
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* ✅ Filter by Source */}
        <select
          style={{ ...btnStyle('#6c63ff'), padding: '8px 12px', color: '#fff' }}
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
        >
          <option value="all">All Sources</option>
          {[...new Set(news.map((n) => n.source?.name))].map(
            (source, idx) => source && <option key={idx} value={source}>{source}</option>
          )}
        </select>

        {/* ✅ Sort by Time */}
        <select
          style={{ ...btnStyle('#9c27b0'), padding: '8px 12px', color: '#fff' }}
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="24h">Last 24h</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
      </div>

      {/* ✅ Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '60%',
            padding: '10px 15px',
            borderRadius: 8,
            border: 'none',
            outline: 'none',
            fontSize: 16,
            backgroundColor: darkMode ? '#1b2b3f' : '#fff',
            color: darkMode ? '#fff' : '#222',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      {/* ✅ News List */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredNews.slice(0, visibleCount).map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: 20,
              padding: 16,
              backgroundColor: darkMode ? 'rgba(27, 43, 63, 0.8)' : 'rgba(255,255,255,0.8)',
              borderRadius: 12,
              color: darkMode ? '#fff' : '#222',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: darkMode ? '#00aaff' : '#1a0dab',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: 18,
              }}
            >
              {item.title}
            </a>
            <p style={{ marginTop: 8, fontSize: 14, color: darkMode ? '#bbb' : '#555' }}>
              {new Date(item.publishedAt).toLocaleString()} | <strong>{item.source?.name}</strong>
            </p>
            <p style={{ marginTop: 8 }}>{item.description || 'No description available.'}</p>
          </li>
        ))}
      </ul>

      {/* ✅ Load More */}
      {visibleCount < filteredNews.length && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={() => setVisibleCount((prev) => prev + 10)} style={btnStyle('#009688')}>
            ⬇ Load More
          </button>
        </div>
      )}
    </div>
  );
}

// 🔹 Button Styling
const btnStyle = (color) => ({
  backgroundColor: color,
  border: 'none',
  borderRadius: 8,
  color: '#fff',
  padding: '8px 16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'transform 0.2s',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
});

export default NewsPage;
