import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentUrls, setRecentUrls] = useState([]);
  const [copied, setCopied] = useState(false);

  // API base URL
  const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : '/api';

  // Load recent URLs on component mount
  useEffect(() => {
    fetchRecentUrls();
  }, []);

  // Fetch recent URLs from the server
  const fetchRecentUrls = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recent`);
      setRecentUrls(response.data);
    } catch (error) {
      console.error('Error fetching recent URLs:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setShortenedUrl('');
    setCopied(false);
    
    // Validate URL
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      setIsLoading(true);
      
      // Send request to the server
      const response = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url
      });
      
      // Set the shortened URL
      setShortenedUrl(response.data.shortUrl);
      
      // Refresh the recent URLs list
      fetchRecentUrls();
      
      // Clear the input field
      setUrl('');
    } catch (error) {
      console.error('Error shortening URL:', error);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to shorten URL. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center text-blue-600">TinyURL Generator</h1>
          <Link 
            to="/debug" 
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-gray-700"
          >
            Debug
          </Link>
        </div>
        
        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isLoading ? 'Generating...' : 'Generate TinyURL'}
          </button>
        </form>
        
        {/* Display Shortened URL */}
        {shortenedUrl && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Your TinyURL:</h2>
            <div className="flex items-center justify-between">
              <a
                href={shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium break-all"
              >
                {shortenedUrl}
              </a>
              <button
                onClick={() => copyToClipboard(shortenedUrl)}
                className="ml-2 p-2 text-blue-600 hover:text-blue-800"
              >
                {copied ? (
                  <span className="text-green-600">Copied!</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Recent URLs Section */}
        {recentUrls.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent URLs</h2>
            <ul className="space-y-2">
              {recentUrls.map((item) => (
                <li key={item.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                  <div className="flex justify-between items-start mb-1">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium text-sm"
                    >
                      {item.shortUrl}
                    </a>
                    <button
                      onClick={() => copyToClipboard(item.shortUrl)}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-600 text-xs truncate">
                    {item.originalUrl}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © 2023 TinyURL Generator. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
