import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = "3714088404f543e59dc28e97ee287ef1";
const COUNTRY = "us";
const CATEGORIES = ["politics", "business", "sports", "entertainment", "health"]

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const today_date = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/top-headlines?country=${COUNTRY}&pageSize=16&apiKey=${API_KEY}`
        );
        const data = await res.json();
        if (data.status === "ok") {
          setArticles(data.articles);
        } else {
          setError("Failed to fetch news.");
        }
      } catch (err) {
        setError("Network error while fetching news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const searchNews = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=16&apiKey=${API_KEY}`
      );
      const data = await res.json();
      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        setError("No news found.");
      }
    } catch (err) {
      setError("Network error while fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (cat) => {
    setQuery("");
    setCategory(cat);
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=${COUNTRY}&category=${cat}&pageSize=16&apiKey=${API_KEY}`
      );
      const data = await res.json();
      if (data.status === "ok") {
        setArticles(data.articles);
      } else {
        setError("No news found.");
      }
    } catch (err) {
      setError("Network error while fetching search results.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <h2>Loading today’s top news...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <h1>Today's News Headlines</h1>
      <h3>{today_date}</h3>

    <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          searchNews();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news by keyword..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="category-buttons">
  {CATEGORIES.map((cat) => (
    <button
      key={cat}
      className={`category-btn ${category === cat ? "active" : ""}`}
      onClick={() => handleCategoryClick(cat)}
    >
      {cat.charAt(0).toUpperCase() + cat.slice(1)}
    </button>
  ))}
</div>

      <div className="news-container">
        {articles.map((article, index) => (
          <div key={index} className="news-card">
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} className="news-image" />
            )}
            <div className="news-content">
              <h3>{article.title}</h3>
              <p>
                <strong>{article.source.name}</strong>
              </p>
            </div>
            <div className="button-container">
              <button
                className="read-btn"
                onClick={() => window.open(article.url, "_blank")}
              >
                Read More →
              </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
