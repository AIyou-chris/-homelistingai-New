-- Function to get total visits and visits by listing
CREATE OR REPLACE FUNCTION get_total_visits_and_by_listing()
RETURNS TABLE(total_visits bigint, visits_by_listing jsonb)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS total_visits,
    jsonb_object_agg(listing_id::text, count) AS visits_by_listing
  FROM (
    SELECT listing_id, COUNT(*) AS count
    FROM visits
    GROUP BY listing_id
  ) sub;
END;
$$; 