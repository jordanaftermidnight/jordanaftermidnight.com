"""Generate a simplified favicon that actually reads at 16-32px.

The full brand emblem (moon + brain + circuits + music notes) is too
detailed to survive being downscaled to favicon sizes — it collapses
to a single-color blob. This mark keeps only the crescent moon (the
most iconic single element) in brand gold on the dark ring, so the
'aftermidnight' brand identity is preserved even at 16×16.

Outputs an SVG (scales infinitely for modern browsers) and PNG
fallbacks at 32/180/192/512 for older browsers, Apple touch, and PWA."""
from pathlib import Path
from PIL import Image, ImageDraw
import math

OUT = Path("/Users/jordan_after_midnight/Projects/software/webdesign/public")

INK  = "#08080F"   # background inside the circle (matches site --ink)
GOLD = "#C19A6B"   # crescent — matches brand --gold
GOLD_HOT = "#E3C089"  # brighter gold for a slight inner glow


def make_svg():
    """Vector favicon. Reads at any size on modern browsers."""
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Dark backing circle -->
  <circle cx="32" cy="32" r="31" fill="{INK}" stroke="{GOLD}" stroke-width="1.2" opacity="0.85"/>
  <!-- Crescent moon: outer disc minus offset inner disc -->
  <mask id="crescent">
    <rect width="64" height="64" fill="black"/>
    <circle cx="32" cy="32" r="20" fill="white"/>
    <circle cx="40" cy="28" r="18" fill="black"/>
  </mask>
  <rect width="64" height="64" fill="{GOLD}" mask="url(#crescent)"/>
</svg>'''
    (OUT / "favicon.svg").write_text(svg)
    print(f"  ✓ favicon.svg ({len(svg)} bytes)")


def make_png(size: int, filename: str):
    """Rasterize the same design at a given size. Uses PIL primitives so
    it stays sharp — no downscaling from a larger source."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = size / 64  # scale factor

    # Dark backing circle with gold outline
    stroke = max(1, int(1.2 * s))
    d.ellipse(
        [(stroke // 2, stroke // 2), (size - stroke // 2 - 1, size - stroke // 2 - 1)],
        fill=INK,
        outline=GOLD,
        width=stroke,
    )

    # Crescent moon: draw filled disc in gold, then subtract offset disc in ink
    moon_r = int(20 * s)
    inner_r = int(18 * s)
    cx, cy = int(32 * s), int(32 * s)
    offset_x, offset_y = int(40 * s), int(28 * s)
    d.ellipse([(cx - moon_r, cy - moon_r), (cx + moon_r, cy + moon_r)], fill=GOLD)
    d.ellipse(
        [(offset_x - inner_r, offset_y - inner_r), (offset_x + inner_r, offset_y + inner_r)],
        fill=INK,
    )

    img.save(OUT / filename, "PNG", optimize=True)
    print(f"  ✓ {filename} ({size}x{size}, {(OUT/filename).stat().st_size} bytes)")


def main():
    make_svg()
    make_png(32,  "favicon.png")
    make_png(180, "apple-touch-icon.png")
    make_png(192, "icon-192.png")   # PWA / Android
    make_png(512, "icon-512.png")   # PWA / larger sizes
    print("\nRemember to update Layout.astro to reference favicon.svg first")


if __name__ == "__main__":
    main()
