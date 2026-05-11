import os

vi_files = ['index.html', 'products.html', 'contact.html', 'projects.html', 'product-detail.html']

about_link = '    <a href="about.html">Giới thiệu</a>\n'

for f in vi_files:
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Skip if already has about.html
    if 'about.html' in content:
        print(f'Skip {f} (already has about link)')
        continue
    
    # Insert after Trang chu line
    old = '<a href="index.html">Trang chủ</a>\n'
    new = '<a href="index.html">Trang chủ</a>\n' + about_link
    
    if old in content:
        content = content.replace(old, new, 1)
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print(f'Updated nav in {f}')
    else:
        print(f'Pattern not found in {f}')
