/*
  # Enable RLS for Chat Tables
*/

ALTER TABLE chat_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to chat visitors"
  ON chat_visitors FOR SELECT
  USING (true);

CREATE POLICY "Public insert to chat visitors"
  ON chat_visitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update to chat visitors"
  ON chat_visitors FOR UPDATE
  USING (true);

CREATE POLICY "Public access to chat messages"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Public insert to chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);
