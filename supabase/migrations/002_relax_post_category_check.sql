-- Relax the essay category check: categories are created implicitly by
-- publishing a post (see lib/blog.ts isValidCategorySlug), not drawn from a
-- fixed list. Enforce slug shape instead of enum membership so this doesn't
-- need another migration for the next new category. The type='note' implies
-- null category invariant from 001_posts.sql is preserved.

alter table posts drop constraint posts_check;

alter table posts add constraint posts_check check (
  type = 'note' and category is null
  or type = 'essay' and category ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
);
