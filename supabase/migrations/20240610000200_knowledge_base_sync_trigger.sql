-- Function to call Edge Function webhook
create or replace function notify_ai_kb_sync()
returns trigger as $$
declare
  response json;
begin
  -- Call the Edge Function webhook (replace with your actual deployment URL)
  perform http_post(
    'https://gezqfksuazkfabhhpaqp.functions.supabase.co/sync-knowledge-base',
    json_build_object('entryId', NEW.id)::text,
    'application/json'
  );
  return NEW;
end;
$$ language plpgsql;

-- Trigger on insert/update/delete
create trigger kb_sync_after_change
after insert or update or delete on knowledge_base_entries
for each row execute procedure notify_ai_kb_sync(); 