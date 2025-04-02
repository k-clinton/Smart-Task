/*
  # Add task features

  1. Changes
    - Add start_date column to tasks table
    - Add priority column to tasks table

  2. Notes
    - start_date is nullable to allow tasks without a specific start time
    - priority can be 'low', 'medium', or 'high'
*/

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date timestamptz;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('low', 'medium', 'high'));