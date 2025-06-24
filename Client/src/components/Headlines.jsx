
import { useEffect, useState } from "react";
import "./Headlines.css" ;
import axios from "axios";

function Headlines() {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
  try {
    const response = await axios.get("https://api.rss2json.com/v1/api.json", {
      params: {
        rss_url: "https://news.google.com/rss/search?q=law",
      },
    });

    const articles = response.data.items
    .slice(0, 5) // Only take top 5
    .map((item) => ({
      title: item.title,
      url: item.link,
    }));

    setHeadlines(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
};

  
    fetchNews(); // Initial fetch
  
    const interval = setInterval(fetchNews, 1800000 ); // Fetch every 30 minutes
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  return (
    <div className="headlines">
      <h2>Latest News</h2>
      <ul>
        {headlines.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Headlines;
