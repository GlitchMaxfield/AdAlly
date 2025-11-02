/*
  # Create Chat System Tables

  1. New Tables
    - `chat_visitors` - Stores visitor session information
    - `chat_messages` - Stores all chat messages
*/

CREATE TABLE IF NOT EXISTS chat_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'waiting',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL,
  sender_type text NOT NULL,
  sender_id uuid,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
