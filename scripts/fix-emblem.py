"""Tighten the circular mask on the emblem — the equalizer-bar tips currently
escape the black circle on the right side. Apply a stricter alpha mask and
regenerate both the gold source and the cyan variant. Copy into the site."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BRAND = Path("/Users/jordan_after_midnight/Projects/webdesign/Jordanaftermidnight-brand/01_PNG_Transparent")
SITE  = Path("/Users/jordan_after_midnight/Projects/software/webdesign/public/brand")
GOLD_SRC = BRAND / "icon_emblem_only.png"

CYAN = (0, 212, 255)


def tighter_circle_mask(img: Image.Image, inset_px: int = 26, feather: float = 1.6) -> Image.Image:
    """Apply a circular alpha mask that fully contains the artwork. Uses
    an alpha-based bbox to find the artwork's true circle, then insets by
    `inset_px` so stray tips beyond the black ring are excluded."""
    img = img.convert("RGBA")
    w, h = img.size

    # Bounding box of visible pixels
    alpha = np.array(img.split()[-1])
    ys, xs = np.where(alpha > 8)
    left, right = xs.min(), xs.max()
    top, bottom = ys.min(), ys.max()
    bbox_w = right - left
    bbox_h = bottom - top

    # Assume the intended circle diameter is the SHORTER bbox dimension
    # (the equalizer stretches the horizontal bbox past the circle).
    diameter = min(bbox_w, bbox_h) - 2 * inset_px
    radius = diameter / 2
    cx = left + bbox_w / 2
    cy = top + bbox_h / 2

    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse(
        (int(cx - radius), int(cy - radius),
         int(cx + radius), int(cy + radius)),
        fill=255,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(feather))

    r, g, b, a = img.split()
    new_alpha = Image.fromarray(
        np.minimum(np.array(a), np.array(mask)).astype("uint8"), "L"
    )
    return Image.merge("RGBA", (r, g, b, new_alpha))


def trim_transparent(img: Image.Image, padding: int = 8) -> Image.Image:
    arr = np.array(img.split()[-1])
    ys, xs = np.where(arr > 8)
    left = max(0, xs.min() - padding)
    right = min(img.width - 1, xs.max() + padding)
    top = max(0, ys.min() - padding)
    bottom = min(img.height - 1, ys.max() + padding)
    return img.crop((left, top, right + 1, bottom + 1))


def recolor_to_cyan(img: Image.Image, target=CYAN,
                    dark_floor=60, gold_peak=200) -> Image.Image:
    arr = np.array(img.convert("RGBA")).astype(np.float32)
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    weight = np.clip((lum - dark_floor) / (gold_peak - dark_floor), 0, 1)
    brightness = np.clip(lum / gold_peak, 0, 1.0)
    tr, tg, tb = target
    nr = r * (1 - weight) + weight * tr * brightness
    ng = g * (1 - weight) + weight * tg * brightness
    nb = b * (1 - weight) + weight * tb * brightness
    out = np.stack([nr, ng, nb, a], axis=-1).clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def main():
    src = Image.open(GOLD_SRC).convert("RGBA")
    print(f"source {src.size}, mode {src.mode}")

    fixed_gold = tighter_circle_mask(src, inset_px=26, feather=1.6)
    fixed_gold = trim_transparent(fixed_gold, padding=6)
    print(f"gold fixed {fixed_gold.size}")

    fixed_cyan = recolor_to_cyan(fixed_gold)
    print(f"cyan fixed {fixed_cyan.size}")

    # Save back to the brand folder (canonical) AND into the site's public/
    fixed_gold.save(BRAND / "icon_emblem_only.png", "PNG", optimize=True)
    fixed_cyan.save(BRAND / "icon_emblem_cyan.png", "PNG", optimize=True)
    fixed_gold.save(SITE / "icon-emblem-gold.png", "PNG", optimize=True)
    fixed_cyan.save(SITE / "icon-emblem-cyan.png", "PNG", optimize=True)
    print("wrote 4 files (2 canonical + 2 site copies)")


if __name__ == "__main__":
    main()
