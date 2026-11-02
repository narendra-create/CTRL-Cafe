-- ==============================================================================
-- Supabase Official Seed File
-- Location: supabase/seed.sql (configured in supabase/config.toml under [db.seed])
-- ==============================================================================

-- 1. PROFILES (Demo User & Admin)
INSERT INTO public.profiles (id, full_name, account_type)
VALUES 
  ('19bbb3a2-2818-44c9-984b-2e86eeaefd15', 'Demo User', 'user'),
  ('d9d1596e-262d-4c77-a18e-6738f28afd8c', 'Demo Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET
  account_type = EXCLUDED.account_type;

-- 2. DEVICES
INSERT INTO public.devices (
  id,
  device_name,
  supports_filtering,
  type,
  max_players,
  hourly_rate,
  extra_console_price
)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'PlayStation 5', true, 'console', 4, 150.00, 50.00),
  ('10000000-0000-4000-8000-000000000002', 'PlayStation 5 Pro', true, 'console', 4, 200.00, 60.00),
  ('10000000-0000-4000-8000-000000000003', 'Xbox Series X', true, 'console', 4, 140.00, 50.00),
  ('10000000-0000-4000-8000-000000000004', 'Gaming PC', true, 'pc', 2, 120.00, NULL),
  ('10000000-0000-4000-8000-000000000005', 'High-End Gaming PC', true, 'pc', 2, 150.00, NULL),
  ('10000000-0000-4000-8000-000000000006', 'Arcade Machine', false, 'arcade', 2, 80.00, NULL),
  ('10000000-0000-4000-8000-000000000007', 'VR Setup', false, 'vr', 1, 250.00, NULL)
ON CONFLICT (id) DO UPDATE SET
  device_name = EXCLUDED.device_name,
  supports_filtering = EXCLUDED.supports_filtering,
  type = EXCLUDED.type,
  max_players = EXCLUDED.max_players,
  hourly_rate = EXCLUDED.hourly_rate,
  extra_console_price = EXCLUDED.extra_console_price;

-- 3. GAME STATIONS (Individual physical/virtual stations for each device)
INSERT INTO public.game_stations (
  id,
  device_id,
  station_label,
  frontend_label,
  is_active
)
VALUES
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'PS5-01', 'PlayStation 5 - Station 1', true),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'PS5-02', 'PlayStation 5 - Station 2', true),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'PS5PRO-01', 'PS5 Pro - VIP Station 1', true),
  ('30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000003', 'XBOX-01', 'Xbox Series X - Station 1', true),
  ('30000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000004', 'PC-01', 'Gaming PC - Rig 1', true),
  ('30000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000004', 'PC-02', 'Gaming PC - Rig 2', true),
  ('30000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000005', 'HIPC-01', 'High-End PC - Rig 1', true),
  ('30000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000006', 'ARC-01', 'Arcade Cabinet 1', true),
  ('30000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000007', 'VR-01', 'VR Arena 1', true)
ON CONFLICT (id) DO UPDATE SET
  station_label = EXCLUDED.station_label,
  frontend_label = EXCLUDED.frontend_label,
  is_active = EXCLUDED.is_active;

-- 4. BOOKINGS (Past, Today, and Future)
INSERT INTO public.bookings (
  id,
  "userId",
  total_amount,
  start_time,
  end_time,
  players_count,
  booking_status,
  is_archived,
  reward_granted,
  paid_amount,
  cancelled_at,
  created_at,
  updated_at
)
VALUES
  -- 1. Oct 12: Past completed
  (
    '20000000-0000-4000-8000-000000000001',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    240.00,
    '2026-10-12 16:00:00+05:30',
    '2026-10-12 18:00:00+05:30',
    2,
    'completed',
    false,
    true,
    240.00,
    NULL,
    '2026-10-11 12:30:00+05:30',
    '2026-10-12 18:00:00+05:30'
  ),
  -- 2. Oct 15: Past completed
  (
    '20000000-0000-4000-8000-000000000002',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    450.00,
    '2026-10-15 14:00:00+05:30',
    '2026-10-15 17:00:00+05:30',
    4,
    'completed',
    false,
    true,
    450.00,
    NULL,
    '2026-10-14 19:20:00+05:30',
    '2026-10-15 17:00:00+05:30'
  ),
  -- 3. Oct 19: Past completed
  (
    '20000000-0000-4000-8000-000000000003',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    250.00,
    '2026-10-19 11:00:00+05:30',
    '2026-10-19 12:00:00+05:30',
    1,
    'completed',
    false,
    true,
    250.00,
    NULL,
    '2026-10-18 20:15:00+05:30',
    '2026-10-19 12:00:00+05:30'
  ),
  -- 4. Oct 22: Past completed
  (
    '20000000-0000-4000-8000-000000000004',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    160.00,
    '2026-10-22 17:00:00+05:30',
    '2026-10-22 19:00:00+05:30',
    2,
    'completed',
    false,
    true,
    160.00,
    NULL,
    '2026-10-21 15:10:00+05:30',
    '2026-10-22 19:00:00+05:30'
  ),
  -- 5. Oct 26: Past completed
  (
    '20000000-0000-4000-8000-000000000005',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    400.00,
    '2026-10-26 18:00:00+05:30',
    '2026-10-26 20:00:00+05:30',
    4,
    'completed',
    false,
    true,
    400.00,
    NULL,
    '2026-10-25 16:45:00+05:30',
    '2026-10-26 20:00:00+05:30'
  ),
  -- 6. Oct 27: Past cancelled
  (
    '20000000-0000-4000-8000-000000000006',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    300.00,
    '2026-10-27 15:00:00+05:30',
    '2026-10-27 17:00:00+05:30',
    2,
    'cancelled',
    false,
    false,
    NULL,
    '2026-10-27 13:20:00+05:30',
    '2026-10-26 18:00:00+05:30',
    '2026-10-27 13:20:00+05:30'
  ),
  -- 7. Oct 30: Past completed
  (
    '20000000-0000-4000-8000-000000000007',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    420.00,
    '2026-10-30 14:00:00+05:30',
    '2026-10-30 17:00:00+05:30',
    3,
    'completed',
    false,
    true,
    420.00,
    NULL,
    '2026-10-29 20:30:00+05:30',
    '2026-10-30 17:00:00+05:30'
  ),
  -- 8. Nov 2 (TODAY Evening): Confirmed
  (
    '20000000-0000-4000-8000-000000000008',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    300.00,
    '2026-11-02 18:00:00+05:30',
    '2026-11-02 20:00:00+05:30',
    2,
    'confirmed',
    false,
    false,
    300.00,
    NULL,
    '2026-11-02 10:30:00+05:30',
    '2026-11-02 10:30:00+05:30'
  ),
  -- 9. Nov 3 (TOMORROW): Confirmed
  (
    '20000000-0000-4000-8000-000000000009',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    420.00,
    '2026-11-03 16:00:00+05:30',
    '2026-11-03 18:00:00+05:30',
    3,
    'confirmed',
    false,
    false,
    420.00,
    NULL,
    '2026-11-02 12:00:00+05:30',
    '2026-11-02 12:00:00+05:30'
  ),
  -- 10. Nov 7 (UPCOMING WEEKEND): Confirmed
  (
    '20000000-0000-4000-8000-000000000010',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    600.00,
    '2026-11-07 14:00:00+05:30',
    '2026-11-07 17:00:00+05:30',
    4,
    'confirmed',
    false,
    false,
    600.00,
    NULL,
    '2026-11-02 14:15:00+05:30',
    '2026-11-02 14:15:00+05:30'
  ),
  -- 11. Nov 11 (NEXT WEEK): Confirmed
  (
    '20000000-0000-4000-8000-000000000011',
    '19bbb3a2-2818-44c9-984b-2e86eeaefd15',
    300.00,
    '2026-11-11 17:00:00+05:30',
    '2026-11-11 19:00:00+05:30',
    2,
    'confirmed',
    false,
    false,
    300.00,
    NULL,
    '2026-11-02 15:00:00+05:30',
    '2026-11-02 15:00:00+05:30'
  )
ON CONFLICT (id) DO UPDATE SET
  "userId" = EXCLUDED."userId",
  total_amount = EXCLUDED.total_amount,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  players_count = EXCLUDED.players_count,
  booking_status = EXCLUDED.booking_status,
  is_archived = EXCLUDED.is_archived,
  reward_granted = EXCLUDED.reward_granted,
  paid_amount = EXCLUDED.paid_amount,
  cancelled_at = EXCLUDED.cancelled_at,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

-- 5. BOOKING STATIONS (The Junction Table: connects each booking to its game station)
INSERT INTO public.booking_stations (
  id,
  booking_id,
  game_station_id,
  players_count,
  start_time,
  end_time
)
VALUES
  -- Booking 1 -> PS5 Station 1
  (
    '40000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    2,
    '2026-10-12 16:00:00+05:30',
    '2026-10-12 18:00:00+05:30'
  ),
  -- Booking 2 -> PS5 Pro VIP Station 1
  (
    '40000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000003',
    4,
    '2026-10-15 14:00:00+05:30',
    '2026-10-15 17:00:00+05:30'
  ),
  -- Booking 3 -> VR Arena 1
  (
    '40000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000003',
    '30000000-0000-4000-8000-000000000009',
    1,
    '2026-10-19 11:00:00+05:30',
    '2026-10-19 12:00:00+05:30'
  ),
  -- Booking 4 -> Gaming PC Rig 1
  (
    '40000000-0000-4000-8000-000000000004',
    '20000000-0000-4000-8000-000000000004',
    '30000000-0000-4000-8000-000000000005',
    2,
    '2026-10-22 17:00:00+05:30',
    '2026-10-22 19:00:00+05:30'
  ),
  -- Booking 5 -> Xbox Series X Station 1
  (
    '40000000-0000-4000-8000-000000000005',
    '20000000-0000-4000-8000-000000000005',
    '30000000-0000-4000-8000-000000000004',
    4,
    '2026-10-26 18:00:00+05:30',
    '2026-10-26 20:00:00+05:30'
  ),
  -- Booking 6 -> Arcade Cabinet 1
  (
    '40000000-0000-4000-8000-000000000006',
    '20000000-0000-4000-8000-000000000006',
    '30000000-0000-4000-8000-000000000008',
    2,
    '2026-10-27 15:00:00+05:30',
    '2026-10-27 17:00:00+05:30'
  ),
  -- Booking 7 -> PlayStation 5 Station 2
  (
    '40000000-0000-4000-8000-000000000007',
    '20000000-0000-4000-8000-000000000007',
    '30000000-0000-4000-8000-000000000002',
    3,
    '2026-10-30 14:00:00+05:30',
    '2026-10-30 17:00:00+05:30'
  ),
  -- Booking 8 (Today Evening) -> PlayStation 5 Station 1
  (
    '40000000-0000-4000-8000-000000000008',
    '20000000-0000-4000-8000-000000000008',
    '30000000-0000-4000-8000-000000000001',
    2,
    '2026-11-02 18:00:00+05:30',
    '2026-11-02 20:00:00+05:30'
  ),
  -- Booking 9 (Tomorrow) -> High-End PC Rig 1
  (
    '40000000-0000-4000-8000-000000000009',
    '20000000-0000-4000-8000-000000000009',
    '30000000-0000-4000-8000-000000000007',
    3,
    '2026-11-03 16:00:00+05:30',
    '2026-11-03 18:00:00+05:30'
  ),
  -- Booking 10 (Upcoming Weekend) -> PS5 Pro VIP Station 1
  (
    '40000000-0000-4000-8000-000000000010',
    '20000000-0000-4000-8000-000000000010',
    '30000000-0000-4000-8000-000000000003',
    4,
    '2026-11-07 14:00:00+05:30',
    '2026-11-07 17:00:00+05:30'
  ),
  -- Booking 11 (Next Week) -> Gaming PC Rig 2
  (
    '40000000-0000-4000-8000-000000000011',
    '20000000-0000-4000-8000-000000000011',
    '30000000-0000-4000-8000-000000000006',
    2,
    '2026-11-11 17:00:00+05:30',
    '2026-11-11 19:00:00+05:30'
  )
ON CONFLICT (id) DO UPDATE SET
  booking_id = EXCLUDED.booking_id,
  game_station_id = EXCLUDED.game_station_id,
  players_count = EXCLUDED.players_count,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time;
