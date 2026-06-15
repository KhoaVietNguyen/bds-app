<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI Conventions

## Admin card/panel background
All cards, panels, and content containers in the admin area must use:
```
bg-card/50 backdrop-blur-md
```
Never use plain `bg-card` for admin views. This applies to every new page, form, section, or modal created in `app/admin/` and `components/admin/`.
