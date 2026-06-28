import os
import glob

html_files = glob.glob("*.html")

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Step 1: Remove existing Login buttons that were added incorrectly
    content = content.replace('<a href="app" class="nav-cta" style="background: var(--dark); margin-left: 8px;">Login</a>\n', '')
    
    # Step 2: Replace Get a Quote with the wrapped group
    old_nav = '<a href="#contact" class="nav-cta">Get a Quote</a>'
    old_nav_index = '<a href="index.html#contact" class="nav-cta">Get a Quote</a>'
    
    new_nav = '''<div class="nav-cta-group" style="display: flex; gap: 10px;">
    <a href="#contact" class="nav-cta">Get a Quote</a>
    <a href="app" class="nav-cta" style="background: var(--dark);">Login</a>
  </div>'''
    
    new_nav_index = '''<div class="nav-cta-group" style="display: flex; gap: 10px;">
    <a href="index.html#contact" class="nav-cta">Get a Quote</a>
    <a href="app" class="nav-cta" style="background: var(--dark);">Login</a>
  </div>'''
    
    content = content.replace(old_nav, new_nav)
    content = content.replace(old_nav_index, new_nav_index)

    # Step 3: Add Login to mobile menu if not present
    mobile_login = '<a href="app" onclick="toggleMenu()" style="background: var(--teal); color: white; text-align: center; border-radius: 8px; margin-top: 10px; border: none;">Login to Portal</a>'
    if mobile_login not in content:
        content = content.replace('</div>\n\n<!-- HERO -->', f'  {mobile_login}\n</div>\n\n<!-- HERO -->')
        content = content.replace('</div>\n<div class="cat-hero">', f'  {mobile_login}\n</div>\n<div class="cat-hero">')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
