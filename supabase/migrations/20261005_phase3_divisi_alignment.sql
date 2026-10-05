-- Align the 2026/27 organization labels with the latest approved terminology.
-- Internal slugs and unit_type values remain unchanged for referential stability.

with t as (
  select id from public.organization_terms where label='2026/27'
)
update public.organization_units u
set name = case u.slug
  when 'akademik' then 'Divisi Akademik'
  when 'olahraga' then 'Divisi Olahraga'
  when 'kemahasiswaan' then 'Divisi Kemahasiswaan'
  when 'kekeluargaan-internal' then 'Divisi Kekeluargaan'
  when 'seni-budaya' then 'Divisi Seni Budaya'
  when 'media' then 'Divisi Media'
  when 'humas-eksternal' then 'Divisi Eksternal'
  else u.name
end,
updated_at = now()
from t
where u.term_id=t.id
  and u.unit_type='department';

with t as (
  select id from public.organization_terms where label='2026/27'
)
update public.organization_positions p
set title = case p.slug
  when 'kepala-akademik' then 'Kepala Divisi Akademik'
  when 'kepala-olahraga' then 'Kepala Divisi Olahraga'
  when 'kepala-kemahasiswaan' then 'Kepala Divisi Kemahasiswaan'
  when 'kepala-kekeluargaan-internal' then 'Kepala Divisi Kekeluargaan'
  when 'kepala-seni-budaya' then 'Kepala Divisi Seni Budaya'
  when 'kepala-media' then 'Kepala Divisi Media'
  when 'kepala-humas-eksternal' then 'Kepala Divisi Eksternal'
  else p.title
end,
updated_at = now()
from t
where p.term_id=t.id;
