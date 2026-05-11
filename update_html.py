import os
import glob

def process_html_files():
    html_files = glob.glob('*.html')
    
    # Hreflang mapping logic
    hreflang_map = {
        'index.html': 'en-index.html',
        'en-index.html': 'index.html',
        'products.html': 'en-products.html',
        'en-products.html': 'products.html',
        'product-detail.html': 'en-product-detail.html',
        'en-product-detail.html': 'product-detail.html',
        'projects.html': 'en-projects.html',
        'en-projects.html': 'projects.html',
        'contact.html': 'en-contact.html',
        'en-contact.html': 'contact.html',
    }
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Add Google Analytics before </head>
        if 'gtag.js' not in content:
            ga_code = """
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
</head>"""
            content = content.replace('</head>', ga_code)

        # 2. Add Hreflang tags
        if 'hreflang' not in content and file in hreflang_map:
            lang = 'en' if file.startswith('en-') else 'vi'
            alt_lang = 'vi' if lang == 'en' else 'en'
            alt_file = hreflang_map[file]
            
            href_tags = f"""
<link rel="alternate" hreflang="{lang}" href="https://dowinvietnam.com/{file}">
<link rel="alternate" hreflang="{alt_lang}" href="https://dowinvietnam.com/{alt_file}">
<link rel="alternate" hreflang="x-default" href="https://dowinvietnam.com/{file if lang == 'vi' else alt_file}">
</head>"""
            content = content.replace('</head>', href_tags)

        # 3. Add Scroll-to-top and Floating Contact before </body>
        if 'floating-contact' not in content:
            floating_html = """
<!-- Floating Contact & Scroll to Top -->
<div class="floating-contact">
    <a href="https://zalo.me/0981422756" class="float-btn zalo-btn" title="Chat Zalo">
        Zalo
    </a>
    <a href="tel:0981422756" class="float-btn phone-btn" title="Gọi điện">
        📞
    </a>
</div>
<button id="scrollToTopBtn" class="scroll-top-btn" title="Lên đầu trang">⬆</button>

<style>
.floating-contact {
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
}
.float-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    transition: transform 0.3s;
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
}
.float-btn:hover {
    transform: scale(1.1);
}
.zalo-btn {
    background-color: #0068ff;
    color: white;
}
.phone-btn {
    background-color: #4CAF50;
    color: white;
    font-size: 24px;
}
.scroll-top-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    background: rgba(13, 42, 82, 0.8);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 20px;
    cursor: pointer;
    display: none;
    z-index: 9999;
}
.scroll-top-btn:hover {
    background: #2c5aa0;
}
@media (max-width: 768px) {
    .floating-contact { bottom: 70px; left: 10px; }
    .scroll-top-btn { bottom: 70px; right: 10px; }
}
</style>
<script>
window.addEventListener('scroll', function() {
    var scrollBtn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 300) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});
document.getElementById('scrollToTopBtn').addEventListener('click', function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
});
</script>
</body>"""
            content = content.replace('</body>', floating_html)

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            print(f"Processed {file}")

if __name__ == "__main__":
    process_html_files()
