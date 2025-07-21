ALTER TABLE knowledge_bases ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES agent_profiles(id);
-- Ensure listing-specific knowledge bases are deleted with the listing
ALTER TABLE knowledge_bases DROP CONSTRAINT IF EXISTS knowledge_bases_listing_id_fkey;
ALTER TABLE knowledge_bases ADD CONSTRAINT knowledge_bases_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;
-- Ensure agent-specific knowledge bases are deleted with the agent profile
ALTER TABLE knowledge_bases DROP CONSTRAINT IF EXISTS knowledge_bases_agent_id_fkey;
ALTER TABLE knowledge_bases ADD CONSTRAINT knowledge_bases_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agent_profiles(id) ON DELETE CASCADE;
-- Ensure knowledge base entries are deleted with the knowledge base
ALTER TABLE knowledge_base_entries DROP CONSTRAINT IF EXISTS knowledge_base_entries_knowledge_base_id_fkey;
ALTER TABLE knowledge_base_entries ADD CONSTRAINT knowledge_base_entries_knowledge_base_id_fkey FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE;

