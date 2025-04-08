import { useState } from 'react';
import axios from 'axios';

const DebugPage = () => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // API base URL
  const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Test URL validation
      console.log('Testing URL:', url);

      // Make direct API call with detailed logging
      const apiResponse = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', apiResponse);
      setResponse(apiResponse.data);
    } catch (err) {
      console.error('Error details:', err);
      
      if (err.response) {
        console.log('Response error data:', err.response.data);
        console.log('Response error status:', err.response.status);
        setError({
          message: err.response.data.error || 'Unknown error',
          status: err.response.status,
          data: err.response.data
        });
      } else if (err.request) {
        console.log('Request error:', err.request);
        setError({
          message: 'No response received from server. Check if server is running.',
          request: 'Request failed'
        });
      } else {
        console.log('Error message:', err.message);
        setError({
          message: err.message || 'Unknown error occurred'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">URL Shortener Debug Page</h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="url" className="block text-gray-700 mb-2">URL to Shorten:</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter URL (e.g., https://www.linkedin.com/in/tanvigour/)"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Test URL Shortening'}
          </button>
        </form>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error:</h2>
            <pre className="bg-red-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
        
        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h2 className="text-lg font-semibold text-green-700 mb-2">Success:</h2>
            <pre className="bg-green-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="font-medium">Shortened URL:</p>
              <a 
                href={response.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {response.shortUrl}
              </a>
              
              <p className="mt-2 font-medium">Original URL:</p>
              <a 
                href={response.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {response.originalUrl}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPage; 