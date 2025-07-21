import React from 'react';
import ScrapingInterface from '../components/shared/ScrapingInterface';
import { ScrapedPropertyData } from '../services/scrapingService';
import { AgentData } from '../services/knowledgeBaseService';

const ScrapingPage: React.FC = () => {
  const handleDataScraped = (data: { listings: ScrapedPropertyData[], agents: AgentData[] }) => {
    console.log('Scraped data:', data);
    console.log(`Properties: ${data.listings.length}, Agents: ${data.agents.length}`);
    
    // Here you could save the data to your database or knowledge base
    // The knowledge base service automatically handles storage in localStorage
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ScrapingInterface onDataScraped={handleDataScraped} />
    </div>
  );
};

export default ScrapingPage; 