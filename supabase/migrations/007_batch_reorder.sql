-- NOTE: This migration needs to be run on Supabase manually or via `supabase db push`
-- It creates an RPC function for batch reordering gifts in a single transaction.

CREATE OR REPLACE FUNCTION batch_reorder_gifts(items jsonb)
RETURNS void AS $$
BEGIN
  UPDATE gifts g SET sort_order = (item->>'sort_order')::int
  FROM jsonb_array_elements(items) AS item
  WHERE g.id = (item->>'id')::uuid
  AND g.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
