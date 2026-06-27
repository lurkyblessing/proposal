import urllib.request
from PIL import Image
import io
import ssl
import sys

ssl._create_default_https_context = ssl._create_unverified_context

urls = {
    'tarte': 'https://aware-bamboo-e88.notion.site/image/attachment%3Ac116c6d8-8a81-411b-aa18-80eab23a26df%3Alogo.webp?id=22248a27-f29b-809f-a243-e193f9b18635&table=block&spaceId=da35d4e3-85cc-4e7f-9f02-18eb25e99f6f&width=520&userId=&cache=v2',
    'farmacy': 'https://aware-bamboo-e88.notion.site/image/attachment%3Ac201c67d-8ffa-4c03-9bf4-246420519ce6%3Alogo.png?id=22948a27-f29b-8003-a5ae-ecb64f81e4d6&table=block&spaceId=da35d4e3-85cc-4e7f-9f02-18eb25e99f6f&width=520&userId=&cache=v2',
    'rem': 'https://aware-bamboo-e88.notion.site/image/attachment%3A195431ad-d0aa-48da-8111-07a6a031b987%3AREM_Beauty_cosmetics_brand_logo.webp?id=22248a27-f29b-8080-b35f-ecfe1e589864&table=block&spaceId=da35d4e3-85cc-4e7f-9f02-18eb25e99f6f&width=520&userId=&cache=v2',
    'hero': 'https://aware-bamboo-e88.notion.site/image/attachment%3Abc5941c9-3cd3-45ef-9a77-b9ee3bb01358%3A92b2feba-e0e8-48a7-b164-64c5227a8573._CR001500300_SX1500_.jpg?id=22248a27-f29b-8019-add3-c64310449aa4&table=block&spaceId=da35d4e3-85cc-4e7f-9f02-18eb25e99f6f&width=520&userId=&cache=v2',
    'elf': 'https://aware-bamboo-e88.notion.site/image/attachment%3Abc52d4b4-2435-4836-bb05-82e157aaf5c0%3Aelf-beauty-600-x-300-1280x640.jpeg?id=22948a27-f29b-8081-aa45-c520efed3024&table=block&spaceId=da35d4e3-85cc-4e7f-9f02-18eb25e99f6f&width=520&userId=&cache=v2'
}

for name, url in urls.items():
    print(f"Processing {name}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = response.read()
        img = Image.open(io.BytesIO(data)).convert('RGBA')
        
        # Save original just in case
        img.save(f"{name}_orig.png")
        
        if name == 'tarte':
            # Tarte keeps background
            img.save(f"{name}.png")
            continue
            
        # Simple color keying for corners (assume white or black background)
        corner = img.getpixel((0,0))
        
        # If it's a solid block logo like ELF which is a black rectangle,
        # we might just make black transparent
        # Let's do a simple flood fill transparency or color matching
        newData = []
        for item in img.getdata():
            # if pixel is close to corner color
            if abs(item[0]-corner[0]) < 25 and abs(item[1]-corner[1]) < 25 and abs(item[2]-corner[2]) < 25:
                newData.append((255, 255, 255, 0))
            else:
                # keep color
                newData.append(item)
                
        img.putdata(newData)
        img.save(f"{name}.png")
        print(f"Saved {name}.png")
