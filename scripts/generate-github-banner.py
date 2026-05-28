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
MUTED = (168, 164, 160)
LINE = (90, 18, 23, 110)

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
    draw.rounded_rectangle(box, radius=22, fill=(18, 18, 18), outline=(58, 58, 58))
    chip_font = font(ARIAL_BOLD, 24)
    bbox = draw.textbbox((0, 0), text, font=chip_font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((x1 + (x2 - x1 - tw) / 2, y1 + (y2 - y1 - th) / 2 - 2), text, font=chip_font, fill=WHITE)


img = Image.new("RGBA", (W, H), BG)
draw = ImageDraw.Draw(img)

glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow)
gdraw.ellipse((220, 70, 930, 590), fill=(105, 0, 10, 110))
gdraw.ellipse((360, 180, 780, 480), fill=(155, 0, 10, 65))
glow = glow.filter(ImageFilter.GaussianBlur(78))
img.alpha_composite(glow)

cx, cy = 600, 300
for rect in [(250, 40, 950, 740), (360, 150, 840, 630), (450, 240, 750, 540)]:
    draw.ellipse(rect, outline=LINE, width=1)
for px, py in [(600, 0), (980, 70), (1220, 190), (1230, 430), (1000, 620), (190, 620), (0, 440), (0, 175), (210, 60)]:
    draw.line((cx, cy, px, py), fill=LINE, width=1)

logo_font = font(ARIAL_BOLD, 32)
draw.text((86, 66), "SNAP", font=logo_font, fill=WHITE)
snap_w = draw.textbbox((86, 66), "SNAP", font=logo_font)[2]
draw.text((snap_w + 94, 66), "LINK", font=logo_font, fill=RED)

hero_font = font(IMPACT, 116)
draw.text((84, 138), "SNAP.", font=hero_font, fill=WHITE)
draw.text((84, 246), "SCAN.", font=hero_font, fill=RED_SOFT)
draw.text((84, 354), "SHORTEN.", font=hero_font, fill=WHITE)

sub_font = font(ARIAL_BOLD, 28)
draw.text((88, 468), "Cinematic URL shortener with QR codes, custom aliases,", font=sub_font, fill=WHITE)
draw.text((88, 506), "and redirect analytics for links you actually share.", font=sub_font, fill=WHITE)

draw_chip(draw, (88, 556, 232, 600), "Node + Express")
draw_chip(draw, (248, 556, 372, 600), "MongoDB")
draw_chip(draw, (388, 556, 516, 600), "QR Built-in")

# small right-side live site block
draw.rounded_rectangle((920, 120, 1186, 382), radius=26, fill=(16, 16, 16), outline=(50, 50, 50))
mini_title = font(ARIAL_BOLD, 24)
mini_body = font(ARIAL_BOLD, 16)
mini_url = font(ARIAL_BOLD, 20)
draw.text((950, 154), "LIVE SITE", font=mini_title, fill=WHITE)
draw.text((950, 190), "Scan to open the deployed project", font=mini_body, fill=MUTED)

if QR_ASSET.exists():
    qr_img = Image.open(QR_ASSET).convert("RGB").resize((146, 146))
    img.paste(qr_img, (984, 220))

draw.text((950, 544), "https://url-shortener-1149.onrender.com", font=mini_url, fill=WHITE)

img.convert("RGB").save(OUT, quality=95)
print(f"Wrote {OUT}")
