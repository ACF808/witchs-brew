from PIL import Image

image = Image.open("public/assets/cork.png").convert("RGBA")
bbox = image.getchannel("A").getbbox()

if bbox:
    image.crop(bbox).save("public/assets/bottling/cork.png")
    print("Cork cropped!")