from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "github-banner.png"
QR_ASSET = ROOT / "assets" / "live-site-qr.png"

W, H = 1280, 640
BG = (7, 7, 7)
RED = (232, 0, 13)
RED_SOFT = (255, 45, 60)
WHITE = (245, 240, 232)
MUTED = (170, 165, 160)
PANEL = (20, 20, 20, 220)
LINE = (90, 18, 23, 120)

FONT_DIR = Path("C:/Windows/Fonts")
IMPACT = str(FONT_DIR / "impact.ttf")
ARIAL_BOLD = str(FONT_DIR / "arialbd.ttf")


def font(path, size):
    try:
        return ImageFont.truetype(path, size=size)
    except Exception:
        return ImageFont.load_default()


def draw_chip(draw, box, text):
    x1, y1, x2, y2 = box
    draw.rounded_rectangle(box, radius=22, fill=(18, 18, 18), outline=(55, 55, 55))
    chip_font = font(ARIAL_BOLD, 24)
    bbox = draw.textbbox((0, 0), text, font=chip_font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((x1 + (x2 - x1 - tw) / 2, y1 + (y2 - y1 - th) / 2 - 2), text, font=chip_font, fill=WHITE)


img = Image.new("RGBA", (W, H), BG)
draw = ImageDraw.Draw(img)

glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow)
gdraw.ellipse((230, 80, 900, 560), fill=(110, 0, 10, 120))
gdraw.ellipse((320, 160, 780, 500), fill=(160, 0, 10, 70))
glow = glow.filter(ImageFilter.GaussianBlur(70))
img.alpha_composite(glow)

draw.ellipse((260, 90, 860, 690), outline=LINE, width=1)
draw.ellipse((370, 185, 750, 570), outline=LINE, width=1)
draw.ellipse((440, 250, 680, 490), outline=LINE, width=1)
cx, cy = 560, 320
for px, py in [(560, 0), (940, 70), (1230, 200), (1210, 460), (930, 640), (180, 640), (0, 470), (0, 180), (180, 70)]:
    draw.line((cx, cy, px, py), fill=LINE, width=1)

logo_font = font(ARIAL_BOLD, 32)
draw.text((84, 64), "SNAP", font=logo_font, fill=WHITE, spacing=4)
snap_w = draw.textbbox((84, 64), "SNAP", font=logo_font)[2]
draw.text((snap_w + 90, 64), "LINK", font=logo_font, fill=RED, spacing=4)
sub_font = font(ARIAL_BOLD, 13)
draw.text((86, 104), "SNAP. SCAN. SHORTEN.", font=sub_font, fill=(150, 150, 150))

hero_font = font(IMPACT, 118)
draw.text((84, 122), "SNAP.", font=hero_font, fill=WHITE)
draw.text((84, 230), "SCAN.", font=hero_font, fill=RED_SOFT)
draw.text((84, 338), "SHORTEN.", font=hero_font, fill=WHITE)

body_font = font(ARIAL_BOLD, 28)
draw.text((88, 462), "Cinematic URL shortener with QR codes, custom aliases,", font=body_font, fill=WHITE)
draw.text((88, 500), "redirect analytics, and a production-ready Express API.", font=body_font, fill=WHITE)

draw_chip(draw, (88, 552, 232, 596), "Node + Express")
draw_chip(draw, (248, 552, 372, 596), "MongoDB")
draw_chip(draw, (388, 552, 516, 596), "QR Built-in")

panel = Image.new("RGBA", (420, 420), (0, 0, 0, 0))
pdraw = ImageDraw.Draw(panel)
pdraw.rectangle((0, 0, 420, 420), fill=PANEL, outline=(55, 55, 55, 180))
panel_font = font(IMPACT, 38)
small = font(ARIAL_BOLD, 18)
medium = font(ARIAL_BOLD, 24)
pdraw.text((34, 34), "WHAT SNAPLINK DOES", font=panel_font, fill=WHITE)
pdraw.text((34, 82), "Shorten once. Share anywhere.", font=medium, fill=MUTED)

pdraw.rectangle((34, 122, 384, 232), fill=(26, 26, 26, 230), outline=(70, 70, 70, 180))
pdraw.text((56, 140), "/OPENAI", font=panel_font, fill=WHITE)
pdraw.text((56, 186), "snplnk.onrender.com/openai", font=medium, fill=WHITE)
pdraw.text((56, 214), "clean alias • public redirect • QR download", font=small, fill=MUTED)

qx, qy = 288, 138
pdraw.rectangle((qx, qy, qx + 72, qy + 72), fill=WHITE)
if QR_ASSET.exists():
    qr_img = Image.open(QR_ASSET).convert("RGB").resize((64, 64))
    panel.paste(qr_img, (qx + 4, qy + 4))
else:
    pdraw.rectangle((qx + 8, qy + 8, qx + 64, qy + 64), outline=BG, width=3)
    pdraw.line((qx + 8, qy + 8, qx + 64, qy + 64), fill=BG, width=3)
    pdraw.line((qx + 64, qy + 8, qx + 8, qy + 64), fill=BG, width=3)

pdraw.text((34, 276), "FEATURES", font=small, fill=MUTED)
pdraw.rectangle((34, 304, 168, 364), fill=(26, 26, 26, 230), outline=(70, 70, 70, 180))
pdraw.rectangle((206, 304, 340, 364), fill=(26, 26, 26, 230), outline=(70, 70, 70, 180))
pdraw.text((54, 320), "FRONTEND", font=small, fill=MUTED)
pdraw.text((54, 344), "Cinematic UI", font=medium, fill=WHITE)
pdraw.text((226, 320), "BACKEND", font=small, fill=MUTED)
pdraw.text((226, 344), "API + analytics", font=medium, fill=WHITE)
pdraw.text((34, 404), "Built to look strong on GitHub and behave like a real product.", font=small, fill=WHITE)

img.alpha_composite(panel, dest=(770, 106))

OUT.parent.mkdir(parents=True, exist_ok=True)
img.convert("RGB").save(OUT, quality=95)
print(f"Wrote {OUT}")
