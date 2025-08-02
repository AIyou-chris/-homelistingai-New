-- Create comparables system tables

-- Comparable properties table
CREATE TABLE IF NOT EXISTS comparable_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  comparable_address TEXT NOT NULL,
  comparable_price DECIMAL(12,2) NOT NULL,
  comparable_bedrooms INTEGER NOT NULL,
  comparable_bathrooms DECIMAL(4,2) NOT NULL,
  comparable_sqft INTEGER NOT NULL,
  comparable_lot_size INTEGER,
  comparable_year_built INTEGER,
  comparable_property_type TEXT,
  comparable_sold_date DATE,
  comparable_days_on_market INTEGER,
  comparable_price_per_sqft DECIMAL(8,2),
  comparable_distance_miles DECIMAL(5,2),
  comparable_features TEXT[],
  comparable_photos TEXT[],
  comparable_source TEXT DEFAULT 'attom' CHECK (comparable_source IN ('attom', 'manual', 'ai_generated')),
  comparable_confidence_score DECIMAL(3,2) DEFAULT 0.00,
  comparable_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comparable analysis table
CREATE TABLE IF NOT EXISTS comparable_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('market_position', 'pricing_recommendation', 'feature_comparison', 'trend_analysis')),
  analysis_data JSONB NOT NULL,
  ai_insights TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market trends table
CREATE TABLE IF NOT EXISTS market_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  trend_period TEXT NOT NULL CHECK (trend_period IN ('30_days', '90_days', '6_months', '1_year')),
  avg_price DECIMAL(12,2) NOT NULL,
  avg_price_per_sqft DECIMAL(8,2) NOT NULL,
  avg_days_on_market INTEGER NOT NULL,
  total_sales INTEGER NOT NULL,
  price_trend TEXT CHECK (price_trend IN ('increasing', 'decreasing', 'stable')),
  market_activity TEXT CHECK (market_activity IN ('high', 'medium', 'low')),
  trend_insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comparable search criteria table
CREATE TABLE IF NOT EXISTS comparable_search_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  search_radius_miles DECIMAL(5,2) DEFAULT 1.0,
  price_range_min DECIMAL(12,2),
  price_range_max DECIMAL(12,2),
  bedroom_range_min INTEGER,
  bedroom_range_max INTEGER,
  bathroom_range_min DECIMAL(4,2),
  bathroom_range_max DECIMAL(4,2),
  sqft_range_min INTEGER,
  sqft_range_max INTEGER,
  year_built_min INTEGER,
  year_built_max INTEGER,
  property_types TEXT[],
  must_have_features TEXT[],
  exclude_features TEXT[],
  sold_within_days INTEGER DEFAULT 365,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comparable reports table
CREATE TABLE IF NOT EXISTS comparable_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  report_title TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('basic', 'detailed', 'ai_enhanced', 'market_analysis')),
  report_data JSONB NOT NULL,
  report_summary TEXT,
  ai_recommendations TEXT[],
  pricing_recommendation DECIMAL(12,2),
  confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comparable_properties_listing_id ON comparable_properties(listing_id);
CREATE INDEX IF NOT EXISTS idx_comparable_properties_price ON comparable_properties(comparable_price);
CREATE INDEX IF NOT EXISTS idx_comparable_properties_distance ON comparable_properties(comparable_distance_miles);
CREATE INDEX IF NOT EXISTS idx_comparable_properties_sold_date ON comparable_properties(comparable_sold_date);
CREATE INDEX IF NOT EXISTS idx_comparable_analysis_listing_id ON comparable_analysis(listing_id);
CREATE INDEX IF NOT EXISTS idx_comparable_analysis_type ON comparable_analysis(analysis_type);
CREATE INDEX IF NOT EXISTS idx_market_trends_listing_id ON market_trends(listing_id);
CREATE INDEX IF NOT EXISTS idx_market_trends_period ON market_trends(trend_period);
CREATE INDEX IF NOT EXISTS idx_comparable_search_criteria_listing_id ON comparable_search_criteria(listing_id);
CREATE INDEX IF NOT EXISTS idx_comparable_reports_listing_id ON comparable_reports(listing_id);

-- Enable RLS
ALTER TABLE comparable_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparable_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparable_search_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparable_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Agents can view comparables for their listings" ON comparable_properties
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can manage comparables for their listings" ON comparable_properties
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view analysis for their listings" ON comparable_analysis
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can manage analysis for their listings" ON comparable_analysis
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view market trends for their listings" ON market_trends
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can manage market trends for their listings" ON market_trends
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view search criteria for their listings" ON comparable_search_criteria
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can manage search criteria for their listings" ON comparable_search_criteria
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can view reports for their listings" ON comparable_reports
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can manage reports for their listings" ON comparable_reports
  FOR ALL USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_comparable_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comparable_search_criteria_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_comparable_properties_updated_at
  BEFORE UPDATE ON comparable_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_comparable_properties_updated_at();

CREATE TRIGGER update_comparable_search_criteria_updated_at
  BEFORE UPDATE ON comparable_search_criteria
  FOR EACH ROW
  EXECUTE FUNCTION update_comparable_search_criteria_updated_at(); 