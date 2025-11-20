import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import SentimentStats from './SentimentStats';
import TweetList from './TweetList';

const Dashboard = () => {
  const [tweets, setTweets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const fetchTweets = async (term = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/tweets/recent?limit=20&searchTerm=${term}`);
      setTweets(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setMessage('Error loading tweets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (term = '') => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tweets/stats?searchTerm=${term}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    setMessage(`Searching for "${term}"...`);
    await Promise.all([fetchTweets(term), fetchStats(term)]);
    setMessage('');
  };

  const handleScrape = async (term) => {
    if (!term.trim()) {
      setMessage('Please enter a search term first');
      return;
    }

    setLoading(true);
    setMessage(`Scraping tweets for "${term}"...`);
    try {
      const response = await axios.post('http://localhost:5000/api/tweets/scrape', {
        searchTerm: term,
        count: 10
      });
      
      setMessage(response.data.message || `Scraped ${response.data.newTweets} new tweets!`);
      
      // Refresh the data
      await Promise.all([fetchTweets(term), fetchStats(term)]);
      
    } catch (error) {
      console.error('Error scraping tweets:', error);
      setMessage(error.response?.data?.error || 'Error scraping tweets');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTweets(), fetchStats()]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setMessage('Error loading initial data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Twitter Sentiment Analysis</h1>
        <p>Real-time sentiment analysis powered by Machine Learning</p>
      </header>

      {message && (
        <div className="message-banner">
          {message}
        </div>
      )}

      <SearchBar 
        onSearch={handleSearch}
        onScrape={handleScrape}
        loading={loading}
      />

      {stats && <SentimentStats stats={stats} searchTerm={searchTerm} />}

      <TweetList 
        tweets={tweets} 
        loading={loading}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default Dashboard;