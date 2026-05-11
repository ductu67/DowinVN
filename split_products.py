import os
import re

def create_product_pages():
    with open('product-detail.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    products = ['dw1000', 'dw1200', 'dw1600']
    
    for prod in products:
        filename = f"{prod[:2]}-{prod[2:]}.html"
        # We inject a script to auto-select the product on load
        script_inject = f"""
        <script>
            window.addEventListener('DOMContentLoaded', () => {{
                const btn = document.querySelector('.machine-btn[onclick*="{prod}"]');
                if(btn) btn.click();
            }});
        </script>
        """
        new_content = content.replace('</body>', script_inject + '\n</body>')
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Created {filename}")

def update_links():
    files_to_update = ['index.html', 'products.html', 'about.html']
    
    for file in files_to_update:
        if not os.path.exists(file): continue
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Example: just replacing general links to product-detail.html in products.html
        if file == 'products.html':
            content = content.replace('<a href="product-detail.html" class="btn btn-outline">Xem chi tiết</a>', 
                                      '<a href="dw-1000.html" class="btn btn-outline">Xem chi tiết</a>')
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated links in {file}")

if __name__ == "__main__":
    create_product_pages()
    update_links()
