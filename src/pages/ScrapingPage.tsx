import React from 'react';

const ScrapingPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Scrape a Listing</h1>
      <p className="mb-4">Enter a listing URL (MLS, Zillow, Realtor.com, etc.) to automatically extract property details and media.</p>
      {/* TODO: Add form for URL input and scraping logic */}
      <form>
        <input type="url" className="w-full p-2 border rounded mb-2" placeholder="Paste listing URL here..." />
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">Scrape Listing</button>
      </form>
    </div>
  );
};

export default ScrapingPage; 