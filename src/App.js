import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [displayDate, setDisplayDate] = useState(null);
  const [category, setCategory] = useState('general');
  const [vnCategory, setVnCategory] = useState('tin-moi-nhat');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [source, setSource] = useState('newsapi'); // 'newsapi' or 'vnexpress'
  const [kenh14Category, setKenh14Category] = useState('kenh14-star'); // Default category
  const [etCategory, setEtCategory] = useState('et-news');
  const [stockCategory, setStockCategory] = useState('vn-stock');
  const [techCategory, setTechCategory] = useState('canada-mobilesyrup');
  const [envCategory, setEnvCategory] = useState('vn-doi-song');


  const fetchNews = async (page = 1, append = false) => {
    try {
      if (source === 'newsapi') {
        const fromDate = new Date(selectedDate);
        const toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 1);

        const fromStr = fromDate.toISOString().split('T')[0];
        const toStr = toDate.toISOString().split('T')[0];

        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = selectedDate === todayStr;

        const endpoint = isToday
          ? `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=50&page=${page}&apiKey=1f295f4683f649e5a933e0671a71d31e`
          : `https://newsapi.org/v2/everything?q=${category}&from=${fromStr}&to=${toStr}&language=en&pageSize=50&page=${page}&apiKey=1f295f4683f649e5a933e0671a71d31e`;

        const res = await axios.get(endpoint);

        if (append) {
          setArticles(prev => [...prev, ...res.data.articles]);
        } else {
          setArticles(res.data.articles);
          setDisplayDate(fromStr);
          setCurrentPage(1);
        }
      } else if (source === 'vnexpress') {
        const res = await axios.get(`http://localhost:8000/vnexpress?category=${vnCategory}&page=${page}`);
        if (append) {
          setArticles(prev => [...prev, ...res.data]);
        } else {
          setArticles(res.data);
          setDisplayDate(new Date().toLocaleDateString());
          setCurrentPage(1);
        }
      } else if (source === 'kenh14') {
        const res = await axios.get(`http://localhost:8000/kenh14?category=${kenh14Category}&page=${page}`);
        if (append) {
          setArticles(prev => [...prev, ...res.data]);
        } else {
          setArticles(res.data);
          setDisplayDate(new Date().toLocaleDateString());
          setCurrentPage(1);
        }
      } else if (source === 'etonline') {
        const res = await axios.get(`http://localhost:8000/etonline?category=${etCategory}&page=${page}`);
        if (append) {
          setArticles(prev => [...prev, ...res.data]);
        } else {
          setArticles(res.data);
          setDisplayDate(new Date().toLocaleDateString());
          setCurrentPage(1);
        }
      } else if (source === 'stocknews') {
        const res = await axios.get(`http://localhost:8000/stocknews?category=${stockCategory}&page=${page}`);
        if (append) {
          setArticles(prev => [...prev, ...res.data]);
        } else {
          setArticles(res.data);
          setDisplayDate(new Date().toLocaleDateString());
          setCurrentPage(1);
        }
      } else if (source === 'technews') {
        const res = await axios.get(`http://localhost:8000/technews?category=${techCategory}&page=${page}`);
        if (append) {
          setArticles(prev => [...prev, ...res.data]);
        } else {
          setArticles(res.data);
          setDisplayDate(new Date().toLocaleDateString());
          setCurrentPage(1);
        }
      } else if (source === 'envnews') {
        const res = await axios.get(`http://localhost:8000/envnews?category=${envCategory}&page=${page}`);
        if (append) {
          setArticles(prev => [...prev, ...res.data]);
        } else {
          setArticles(res.data);
          setDisplayDate(new Date().toLocaleDateString());
          setCurrentPage(1);
        }
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  const loadMoreArticles = () => {
    const nextPage = currentPage + 1;
    setLoadingMore(true);
    fetchNews(nextPage, true).then(() => {
      setCurrentPage(nextPage);
      setLoadingMore(false);
    });
  };

  return (
    <div className="news-container" style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Daily News Digest</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="lang-switcher"><strong>Language:</strong></label>
        <select
          id="lang-switcher"
          onChange={(e) => {
            const lang = e.target.value;
            const frame = document.querySelector("iframe.goog-te-banner-frame");
            if (lang === "original") {
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              window.location.reload();
            } else {
              const code = {
                en: "/en",
                vi: "/vi",
                fr: "/fr"
              }[lang];
              document.cookie = `googtrans=/auto${code}; path=/; domain=${window.location.hostname}`;
              window.location.reload();
            }
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="original">🌐 Original</option>
          <option value="en">English</option>
          <option value="vi">Vietnamese</option>
          <option value="fr">French</option>
        </select>
      </div>


      <div style={{ marginBottom: '1rem' }}>
        <strong>Source:</strong>
        <button onClick={() => setSource('newsapi')} style={{ marginLeft: '1rem' }} disabled={source === 'newsapi'}>
          NewsAPI
        </button>
        <button onClick={() => setSource('vnexpress')} style={{ marginLeft: '0.5rem' }} disabled={source === 'vnexpress'}>
          VnExpress
        </button>
        <button onClick={() => setSource('kenh14')} disabled={source === 'kenh14'}>
          Kenh14
        </button>
        <button onClick={() => setSource('etonline')} style={{ marginLeft: '0.5rem' }} disabled={source === 'etonline'}>
          EntTonight
        </button>
        <button onClick={() => setSource('stocknews')} style={{ marginLeft: '0.5rem' }} disabled={source === 'stocknews'}>
          Stock Market
        </button>
        <button onClick={() => setSource('technews')} style={{ marginLeft: '0.5rem' }} disabled={source === 'technews'}>
          Tech & AI News
        </button>
        <button onClick={() => setSource('envnews')} style={{ marginLeft: '0.5rem' }} disabled={source === 'envnews'}>
          Environment
        </button>

      </div>

      {source === 'newsapi' && (
        <>
          <label htmlFor="date-picker">Select a date:</label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          />

          <label htmlFor="category-select" style={{ marginLeft: '1rem' }}>Select category:</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="general">General</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
        </>
      )}

      {source === 'vnexpress' && (
        <>
          <label htmlFor="vn-category-select">Select VnExpress category:</label>
          <select
            id="vn-category-select"
            value={vnCategory}
            onChange={(e) => setVnCategory(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="tin-moi-nhat">Tin Mới Nhất</option>
            <option value="the-gioi">Thế Giới</option>
            <option value="kinh-doanh">Kinh Doanh</option>
            <option value="the-thao">Thể Thao</option>
            <option value="giai-tri">Giải Trí (Entertainment)</option>
            <option value="doi-song">Đời Sống (Lifestyle)</option>
            <option value="du-lich">Du Lịch (Travel)</option>
            <option value="giao-duc">Giáo Dục</option>
            <option value="suc-khoe">Sức Khỏe</option>
            <option value="so-hoa">Số Hóa</option>
          </select>
        </>
      )}

      {source === 'kenh14' && (
        <>
          <label htmlFor="kenh14-category-select">Select Kenh14 category:</label>
          <select
            id="kenh14-category-select"
            value={kenh14Category}
            onChange={(e) => setKenh14Category(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="kenh14-star">Sao (Celebrities)</option>
            <option value="kenh14-musik">Âm Nhạc (Music)</option>
            <option value="kenh14-cine">Phim (Movies)</option>
            <option value="kenh14-tvshow">TV Show</option>
            <option value="kenh14-beauty-fashion">Đẹp - Fashion</option>
            <option value="kenh14-life">Đời Sống</option>
            <option value="kenh14-society">Xã Hội</option>
            <option value="kenh14-international">Thế Giới Đó Đây</option>
            <option value="kenh14-health">Sức Khỏe</option>
            <option value="kenh14-eat-travel">Ăn Quẩy Đi (Food & Travel)</option>
            <option value="kenh14-sport">Thể Thao</option>
            <option value="kenh14-tek-life">Tek Life</option>
            <option value="kenh14-school">Học Đường (School)</option>
            <option value="kenh14-watch-buy">Xem Mua Luôn (Shopping)</option>
          </select>
        </>
      )}

      {source === 'etonline' && (
        <>
          <label htmlFor="et-category-select">Select ET Online category:</label>
          <select
            id="et-category-select"
            value={etCategory}
            onChange={(e) => setEtCategory(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="et-news">News</option>
            <option value="et-photos">Photos</option>
            <option value="et-videos">Videos</option>
            <option value="et-tv">TV</option>
            <option value="et-style">Style</option>
            <option value="et-fashion">Fashion</option>
            <option value="et-lifestyle">Lifestyle</option>
            <option value="et-shopping">Shopping</option>
            <option value="et-music">Music</option>
            <option value="et-movies">Movies</option>
          </select>
        </>
      )}

      {source === 'stocknews' && (
        <>
          <label htmlFor="stock-category-select">Select Stock Market Source:</label>
          <select
            id="stock-category-select"
            value={stockCategory}
            onChange={(e) => setStockCategory(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          >
            <option value="vn-stock">Vietnam Stock Market</option>
            <option value="global-stock">Global Market (MarketWatch)</option>
          </select>
        </>
      )}

      {source === 'technews' && (
        <>
          <label htmlFor="tech-category-select">Select Tech Source:</label>
          <select
            id="tech-category-select"
            value={techCategory}
            onChange={(e) => setTechCategory(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          >
            <optgroup label="Vietnam">
              <option value="vietnam-vna">VNA Technology</option>
              <option value="vietnam-ein">EIN News (Vietnam)</option>
              <option value="vietnam-vietnamplus">VietnamPlus Technology</option>
            </optgroup>

            <optgroup label="Canada">
              <option value="canada-mobilesyrup">MobileSyrup</option>
              <option value="canada-betakit">BetaKit</option>
              <option value="canada-itworld">IT World Canada</option>
            </optgroup>

            <optgroup label="World">
              <option value="world-wired">WIRED</option>
              <option value="world-techcrunch">TechCrunch</option>
              <option value="world-aiblog">AI Blog</option>
            </optgroup>
          </select>
        </>
      )}

      {source === 'envnews' && (
        <>
          <label htmlFor="env-category-select">Select Environmental News Source:</label>
          <select
            id="env-category-select"
            value={envCategory}
            onChange={(e) => setEnvCategory(e.target.value)}
            style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}
          >
            <optgroup label="Vietnam">
              <option value="vn-doi-song">VnExpress – Đời Sống</option>
              <option value="vietnam-vnexpress-khoahoc">VnExpress – Khoa Học</option>
            </optgroup>
            <optgroup label="World">
              <option value="global-unep">UN Environment Programme (UNEP)</option>
              <option value="global-globalissues">Global Issues</option>
              <option value="global-grist">Grist</option>
            </optgroup>
          </select>
        </>
      )}


      <button onClick={() => fetchNews()} style={{ display: 'block', margin: '1rem 0' }}>Generate News</button>

      {displayDate && <h2>News for: {displayDate} - Source: {source}</h2>}
      {articles.map((article, idx) => {
        const query = encodeURIComponent(article.title);
        const googleSearchUrl = `https://www.google.com/search?q=${query}&tbm=nws`;
        const bingSearchUrl = `https://www.bing.com/news/search?q=${query}`;
        const googleFeedUrl = `https://news.google.com/search?q=${query}`;

        return (
          <div key={idx} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem', paddingTop: '1px' }}>
            <h3>{article.title}</h3>
            <p>{article.description || article.contentSnippet}</p>
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt="Article visual" 
                className="article-image"
              />
            )}
            {article.imageUrl && (
              <img 
                src={article.imageUrl} 
                alt="Article visual" 
                className="article-image"
              />
            )}
            <a href={article.url || article.link} target="_blank" rel="noopener noreferrer" className = "read-more-button">Read more</a>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>More Sources:</strong>
              <ul>
                <li><a href={googleSearchUrl} target="_blank" rel="noopener noreferrer">Google News Search</a></li>
                <li><a href={bingSearchUrl} target="_blank" rel="noopener noreferrer">Bing News Search</a></li>
                <li><a href={googleFeedUrl} target="_blank" rel="noopener noreferrer">Google News Feed</a></li>
              </ul>
            </div>
          </div>
        );
      })}

      {articles.length > 0 && (
        <button onClick={loadMoreArticles} disabled={loadingMore} style={{ marginTop: '1rem' }}>
          {loadingMore ? 'Loading...' : 'Load More Articles'}
        </button>
      )}
    </div>
  );
};

export default App;
