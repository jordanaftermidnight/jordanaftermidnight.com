"""Compress emblem assets for web. Icon variants (used at 128px in the hero)
get resized to 400px + saved as WebP with PNG fallback. Full logotypes stay
larger for potential print/wide use.

Canonical high-res sources remain in the brand kit; this only touches the
site's public copies."""
from pathlib import Path
from PIL import Image

SITE = Path("/Users/jordan_after_midnight/Projects/software/webdesign/public")

# (path, max_width, keep_png)
targets = [
    (SITE / "brand/icon-emblem-gold.png",  400, True),   # hero — 128px display, retina 3x
    (SITE / "brand/icon-emblem-cyan.png",  400, True),
    (SITE / "brand/logo-primary-gold.png", 800, True),   # future header use
    (SITE / "brand/logo-primary-cyan.png", 800, True),
]

total_before = 0
total_after = 0

for path, max_width, keep_png in targets:
    if not path.exists():
        print(f"  ! missing: {path}")
        continue

    before = path.stat().st_size
    img = Image.open(path).convert("RGBA")
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)

    # PNG (fallback)
    if keep_png:
        img.save(path, "PNG", optimize=True)
        png_size = path.stat().st_size
    else:
        png_size = 0
        path.unlink(missing_ok=True)

    # WebP (primary)
    webp_path = path.with_suffix(".webp")
    img.save(webp_path, "WEBP", quality=85, method=6)
    webp_size = webp_path.stat().st_size

    after = png_size + webp_size
    print(f"  {path.name:32s}  {before/1024:6.0f}KB → PNG {png_size/1024:5.0f}KB + WebP {webp_size/1024:5.0f}KB "
          f"({img.width}x{img.height})")
    total_before += before
    total_after += after

print(f"\ntotal: {total_before/1024/1024:.1f}MB → {total_after/1024:.0f}KB "
      f"({100*(1-total_after/total_before):.0f}% smaller)")
print("→ update components to use <picture> with WebP source + PNG fallback")
