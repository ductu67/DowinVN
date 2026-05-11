import os
import glob

def update_facebook_links():
    html_files = glob.glob('*.html')
    old_link = "https://www.facebook.com/profile.php?id=61563358184241"
    new_link = "https://www.facebook.com/people/Dowinvietnam/61578386100164/"
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if old_link in content:
            content = content.replace(old_link, new_link)
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated Facebook link in {file}")

if __name__ == "__main__":
    update_facebook_links()
