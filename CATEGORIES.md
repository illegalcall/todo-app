# Categories Feature

Open Edit tags on a todo to add a category, including multi-word names. Tags
are trimmed and duplicates are ignored regardless of letter case. Remove a
tag with its labeled remove control. Filter by tag shows matching todos;
All tags restores the full list without changing hidden todos. Untagged
todos and the existing add/toggle/delete controls remain supported.

Tags share the page's current in-memory todo lifetime; persistence is a
separate feature. Implements issue #26.
