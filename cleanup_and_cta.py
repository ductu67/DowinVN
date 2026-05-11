import re
import os

vi_files = ['index.html', 'products.html', 'contact.html', 'projects.html', 'product-detail.html', 'about.html']

STICKY_CTA = '''
<!-- Sticky Mobile CTA Bar -->
<div class="sticky-mobile-cta">
    <a href="https://zalo.me/0981422756" class="cta-zalo">💬 Chat Zalo</a>
    <a href="tel:0981422756" class="cta-phone">📞 Gọi ngay</a>
</div>
'''

for f in vi_files:
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()

    # 1. Remove inline <style> blocks that duplicate floating CSS
    # (the ones injected by the Python script earlier - between <style> and </style> after floating-contact)
    pattern = r'<style>\s*\.floating-contact\s*\{.*?\}\s*</style>'
    content_clean = re.sub(pattern, '', content, flags=re.DOTALL)

    # 2. Add sticky CTA bar if not already present
    if 'sticky-mobile-cta' not in content_clean:
        content_clean = content_clean.replace('</body>', STICKY_CTA + '\n</body>')

    with open(f, 'w', encoding='utf-8') as fp:
        fp.write(content_clean)
    print(f'Processed {f}')

print('Done!')
