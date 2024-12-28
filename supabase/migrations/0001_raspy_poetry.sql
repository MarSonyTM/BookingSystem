/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (text, for identifying the user)
      - `date` (timestamptz, when the booking is scheduled)
      - `service_type` (text, either 'physio' or 'massage')
      - `status` (text, booking status)
      - `created_at` (timestamptz, when the booking was created)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for read and write access
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  date timestamptz NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('physio', 'massage')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access"
  ON bookings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert access"
  ON bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update access"
  ON bookings
  FOR UPDATE
  USING (true);

-- Create index for common queries
CREATE INDEX bookings_date_idx ON bookings (date);
CREATE INDEX bookings_user_id_idx ON bookings (user_id);
CREATE INDEX bookings_status_idx ON bookings (status);