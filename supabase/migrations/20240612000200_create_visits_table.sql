-- Create visits table for tracking property/listing page views and QR code-driven visits
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    qr_code_id VARCHAR(64), -- Optional: store QR code identifier if visit came from QR
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT,
    ip_address INET,
    metadata JSONB
);

CREATE INDEX idx_visits_listing_id ON visits(listing_id);
CREATE INDEX idx_visits_qr_code_id ON visits(qr_code_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at); 