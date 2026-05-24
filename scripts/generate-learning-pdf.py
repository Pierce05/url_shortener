from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, Preformatted, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "learning-journal.md"
TARGET = ROOT / "docs" / "learning-journal.pdf"


def build_styles():
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "CustomTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            textColor=colors.HexColor("#8f3f18"),
            spaceAfter=14,
        ),
        "h1": ParagraphStyle(
            "Heading1",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=17,
            leading=22,
            textColor=colors.HexColor("#1d1b18"),
            spaceBefore=10,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "Heading2",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#1d1b18"),
            spaceBefore=8,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#2d2926"),
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "BulletBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            leftIndent=14,
            firstLineIndent=-8,
            textColor=colors.HexColor("#2d2926"),
            spaceAfter=4,
        ),
        "code": ParagraphStyle(
            "Code",
            parent=styles["Code"],
            fontName="Courier",
            fontSize=8.8,
            leading=11,
            backColor=colors.HexColor("#f4ede4"),
            borderPadding=8,
            borderColor=colors.HexColor("#e2d2bf"),
            borderWidth=0.5,
            borderRadius=4,
            spaceAfter=10,
        ),
    }


def inline(text: str) -> str:
  return (
      text.replace("&", "&amp;")
      .replace("<", "&lt;")
      .replace(">", "&gt;")
      .replace("`", "")
  )


def markdown_to_story(markdown: str):
    styles = build_styles()
    story = []
    in_code = False
    code_lines = []

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()

        if line.startswith("```"):
            if in_code:
                story.append(Preformatted("\n".join(code_lines), styles["code"]))
                code_lines = []
                in_code = False
            else:
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line:
            story.append(Spacer(1, 0.18 * cm))
            continue

        if line.startswith("# "):
            story.append(Paragraph(inline(line[2:]), styles["title"]))
            continue

        if line.startswith("## "):
            story.append(Paragraph(inline(line[3:]), styles["h1"]))
            continue

        if line.startswith("### "):
            story.append(Paragraph(inline(line[4:]), styles["h2"]))
            continue

        if line.startswith("- "):
            story.append(Paragraph(f"• {inline(line[2:])}", styles["bullet"]))
            continue

        if raw_line[:3].isdigit() and raw_line[1:3] == ". ":
            story.append(Paragraph(inline(line), styles["bullet"]))
            continue

        story.append(Paragraph(inline(line), styles["body"]))

    return story


def main():
    markdown = SOURCE.read_text(encoding="utf-8")
    story = markdown_to_story(markdown)
    doc = SimpleDocTemplate(
        str(TARGET),
        pagesize=A4,
        leftMargin=1.7 * cm,
        rightMargin=1.7 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title="URL Shortener Learning Journal",
    )
    doc.build(story)
    print(f"Wrote {TARGET}")


if __name__ == "__main__":
    main()
