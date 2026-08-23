"""Post-resize circular clip for the site emblem assets.

The canonical brand kit has a soft circular mask at 2000px, which loses
precision when downsampled to 400px + WebP-compressed. Equalizer-bar tips
that were subtly clipped at 2k become visibly poking out of the circle at
400×0.85-quality WebP.

Fix: after resize, re-apply a hard circular mask at the 400px scale
(inset in absolute pixels), so anything outside the circle is definitively
transparent in the final asset."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SITE = Path("/Users/jordan_after_midnight/Projects/software/webdesign/public/brand")
CANONICAL = Path("/Users/jordan_after_midnight/Projects/webdesign/Jordanaftermidnight-brand/01_PNG_Transparent")

CYAN = (0, 212, 255)


def hard_circular_clip(img: Image.Image, inset_px: int = 8, feather: float = 0.9) -> Image.Image:
    """Apply a circular alpha mask centered on the artwork bbox.
    Uses the SHORTER bbox dimension minus `inset_px` as the diameter,
    so equalizer bars stretching the horizontal bbox don't fool it."""
    img = img.convert("RGBA")
    w, h = img.size
    alpha = np.array(img.split()[-1])
    ys, xs = np.where(alpha > 8)
    left, right = xs.min(), xs.max()
    top, bottom = ys.min(), ys.max()
    bbox_w = right - left
    bbox_h = bottom - top

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
    if feather > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    r, g, b, a = img.split()
    new_a = Image.fromarray(
        np.minimum(np.array(a), np.array(mask)).astype("uint8"), "L"
    )
    return Image.merge("RGBA", (r, g, b, new_a))


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
    # Source from the canonical (high-res, has whatever mask was last applied)
    src_gold = Image.open(CANONICAL / "icon_emblem_only.png").convert("RGBA")
    print(f"canonical size: {src_gold.size}")

    # Resize to site display size (400px)
    ratio = 400 / src_gold.width
    resized_gold = src_gold.resize((400, int(src_gold.height * ratio)), Image.LANCZOS)

    # Hard circular clip at the site scale — the equalizer bars in the
    # source touch the circle edge; an inset of ~24px at 400px scale ends
    # the bars visibly inside the circle, no illusion of "escaping tips."
    clipped_gold = hard_circular_clip(resized_gold, inset_px=24, feather=1.0)
    clipped_cyan = recolor_to_cyan(clipped_gold)

    # Save both formats
    for tag, img in [("gold", clipped_gold), ("cyan", clipped_cyan)]:
        png_path  = SITE / f"icon-emblem-{tag}.png"
        webp_path = SITE / f"icon-emblem-{tag}.webp"
        img.save(png_path, "PNG", optimize=True)
        img.save(webp_path, "WEBP", quality=85, method=6)
        print(f"  {tag}: PNG {png_path.stat().st_size//1024}KB  WebP {webp_path.stat().st_size//1024}KB  ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    main()
