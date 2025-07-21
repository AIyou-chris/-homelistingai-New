-- Add RLS policies for tables that are missing them

-- Knowledge base tables
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_entry_versions ENABLE ROW LEVEL SECURITY;

-- Knowledge base policies
CREATE POLICY "Users can view their own knowledge bases" ON knowledge_bases
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own knowledge bases" ON knowledge_bases
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own knowledge bases" ON knowledge_bases
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own knowledge bases" ON knowledge_bases
  FOR DELETE USING (auth.uid() = created_by);

-- Knowledge base entries policies
CREATE POLICY "Users can view entries for their knowledge bases" ON knowledge_base_entries
  FOR SELECT USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create entries for their knowledge bases" ON knowledge_base_entries
  FOR INSERT WITH CHECK (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update entries for their knowledge bases" ON knowledge_base_entries
  FOR UPDATE USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete entries for their knowledge bases" ON knowledge_base_entries
  FOR DELETE USING (
    knowledge_base_id IN (
      SELECT id FROM knowledge_bases WHERE created_by = auth.uid()
    )
  );

-- Knowledge base entry versions policies
CREATE POLICY "Users can view versions for their entries" ON knowledge_base_entry_versions
  FOR SELECT USING (
    entry_id IN (
      SELECT id FROM knowledge_base_entries 
      WHERE knowledge_base_id IN (
        SELECT id FROM knowledge_bases WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create versions for their entries" ON knowledge_base_entry_versions
  FOR INSERT WITH CHECK (
    entry_id IN (
      SELECT id FROM knowledge_base_entries 
      WHERE knowledge_base_id IN (
        SELECT id FROM knowledge_bases WHERE created_by = auth.uid()
      )
    )
  );

-- Visits table
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Visits policies (agents can view visits for their listings)
CREATE POLICY "Agents can view visits for their listings" ON visits
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

-- Public can create visits (for tracking)
CREATE POLICY "Anyone can create visits" ON visits
  FOR INSERT WITH CHECK (true);

-- Service role can manage all visits
CREATE POLICY "Service role can manage all visits" ON visits
  FOR ALL USING (auth.role() = 'service_role'); 