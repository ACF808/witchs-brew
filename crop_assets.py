from PIL import Image
from pathlib import Path

folder = Path("public/assets/bottling")

for name in ["bottle-round.png", "bottle-tall.png", "ladle.png"]:
    path = folder / name

    image = Image.open(path).convert("RGBA")
    bounds = image.getchannel("A").getbbox()

    if bounds:
        cropped = image.crop(bounds)
        cropped.save(path)
        print(f"Cropped {name}: {image.size} -> {cropped.size}")
    else:
        print(f"No visible pixels found in {name}")