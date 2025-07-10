-- Enhance knowledge_bases table for agent/listing/global KB support

-- 1. Add agent_id column
ALTER TABLE knowledge_bases
  ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES agent_profiles(id);

-- 2. Make listing_id nullable
ALTER TABLE knowledge_bases
  ALTER COLUMN listing_id DROP NOT NULL;

-- 3. Update FKs to use ON DELETE CASCADE
ALTER TABLE knowledge_bases DROP CONSTRAINT IF EXISTS knowledge_bases_listing_id_fkey;
ALTER TABLE knowledge_bases
  ADD CONSTRAINT knowledge_bases_listing_id_fkey
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;

ALTER TABLE knowledge_bases DROP CONSTRAINT IF EXISTS knowledge_bases_agent_id_fkey;
ALTER TABLE knowledge_bases
  ADD CONSTRAINT knowledge_bases_agent_id_fkey
  FOREIGN KEY (agent_id) REFERENCES agent_profiles(id) ON DELETE CASCADE;

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_agent_id ON knowledge_bases(agent_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_listing_id ON knowledge_bases(listing_id); 