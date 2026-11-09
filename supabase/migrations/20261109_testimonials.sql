-- Testimonials table
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  text text not null,
  product_name text,
  product_id text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Allow public inserts (submissions), restrict reads to service role
alter table testimonials enable row level security;

create policy "Anyone can submit a testimonial"
  on testimonials for insert
  to anon, authenticated
  with check (true);

create policy "Service role can do anything"
  on testimonials for all
  to service_role
  using (true)
  with check (true);
