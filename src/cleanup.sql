-- First, delete all data from related tables
DELETE FROM profiles;
DELETE FROM bookings;

-- Delete all users from auth.users
DELETE FROM auth.users;

-- Reset the identity sequences if any
ALTER SEQUENCE IF EXISTS bookings_id_seq RESTART WITH 1;

-- Verify the cleanup
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM bookings; 