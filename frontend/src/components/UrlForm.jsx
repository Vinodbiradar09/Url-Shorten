import React, { useState } from 'react'
import { createShortUrl } from "../api/shortUrl.api";
import { useNavigate } from '@tanstack/react-router';

const UrlForm = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [shortUrl, setShortUrl] = useState();
  // const [customSlug , setCustomSlug] = useState();
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if(url.trim() === ""){
      setError("URL is required");
      return
    };
    try {
      const shortUrl = await createShortUrl(url);
      setShortUrl(shortUrl);
      setError(null);

      console.log(shortUrl);

    } catch (error) {
      setError(error.message || "Failed to create Url");
    }
  }

  const handleCopy = async () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const handleLogin = () => {
   navigate({to : "/auth"});
  }

  return (
    <>
  

    <div className='space-y-4'>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your URL
        </label>
        <input type="url" id='url' placeholder="https://example.com" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={url} onInput={(e) => setUrl(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        type='submit'
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >Shorten Url</button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2"> Your shortened URL:</h2>
          <div className="flex items-center">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
            />

            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-r-md transition-colors duration-200 ${copied
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default UrlForm