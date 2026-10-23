-- Optional sample content so every page has something to show.
-- Run after schema.sql in the SQL Editor. Delete or edit the rows later in the Table Editor.

insert into public.programs (slug, name, description) values
  ('digital-skills', 'Digital Skills', 'Practical training in in-demand digital skills.'),
  ('mentorship', 'Mentorship', 'Guidance from professionals who have walked the path.'),
  ('advocacy', 'Advocacy', 'Campaigns that give young people a voice.');

with c as (
  insert into public.courses (name, description, difficulty, start_date)
  values ('Introduction to Web Development', 'Build your first website with HTML, CSS and JavaScript.', 'Beginner', current_date + 14)
  returning id
)
insert into public.course_modules (course_id, module_number, title)
select c.id, m.n, m.title
from c, (values (1, 'How the web works'), (2, 'HTML basics'), (3, 'Styling with CSS')) as m (n, title);

insert into public.events (title, description, event_date, location) values
  ('Youth Career Fair', 'Meet employers and learn about opportunities.', now() + interval '21 days', 'Accra'),
  ('Digital Skills Workshop', 'A hands-on afternoon of building with code.', now() + interval '35 days', 'Online');

insert into public.jobs (title, company, description, deadline) values
  ('Junior Web Developer (Intern)', 'Partner Company', 'A three-month paid internship for beginners.', current_date + 30);
