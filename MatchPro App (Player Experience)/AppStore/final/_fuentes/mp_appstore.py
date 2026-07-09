#!/usr/bin/env python3
"""
MatchPro - App Store screenshots (iPhone 6.9", 1320x2868).
Fondo ADAPTATIVO: claro para pantallas claras, charcoal para oscuras.
Las capturas ya traen su barra de estado real -> NO se dibuja isla sintetica.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

W, H = 1320, 2868
BASE = "/sessions/eloquent-ecstatic-cannon/mnt/MatchPro App (Player Experience)/AppStore/final"
SRC  = BASE + "/_fuentes"
OUT  = BASE
os.makedirs(OUT, exist_ok=True)
FB = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
FM = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"

LIME = (174, 224, 76)
ISO = Image.open(BASE + "/_fuentes/iso_color.png").convert("RGBA")

def dgrad(w, h, c1, c2):
    """Degradado diagonal (esquina sup-izq -> inf-der). Mas dinamico que el vertical."""
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(0, w, 2):
            k = (x / w + y / h) / 2
            c = tuple(int(c1[i] + (c2[i] - c1[i]) * k) for i in range(3))
            px[x, y] = c
            if x + 1 < w:
                px[x + 1, y] = c
    return img

def glow(w, h, cx, cy, radius, color, alpha):
    """Halo radial suave (RGBA) para dar dinamismo y separar el device del fondo."""
    g = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
              fill=color + (alpha,))
    return g.filter(ImageFilter.GaussianBlur(radius // 2))

def rmask(w, h, r):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], radius=r, fill=255)
    return m

def device(path, screen_w, bezel=22, r_dev=104, r_scr=82, body=(8, 10, 9)):
    s = Image.open(path).convert("RGB")
    w, h = s.size
    sh = int(screen_w * h / w)
    s = s.resize((screen_w, sh), Image.LANCZOS)
    dw, dh = screen_w + bezel * 2, sh + bezel * 2
    d = Image.new("RGBA", (dw, dh), (0, 0, 0, 0))
    d.paste(Image.new("RGBA", (dw, dh), body + (255,)), (0, 0), rmask(dw, dh, r_dev))
    d.paste(s, (bezel, bezel), rmask(screen_w, sh, r_scr))
    return d

def cdraw(d, cx, y, t, f, fill, tr=0):
    ws = [d.textlength(c, font=f) for c in t]
    tot = sum(ws) + tr * (len(t) - 1)
    x = cx - tot / 2
    for c, w in zip(t, ws):
        d.text((x, y), c, font=f, fill=fill)
        x += w + tr

def frame(out_name, shot, title, sub, theme="light"):
    if theme == "light":
        # near-white frio con tinte lime sutil en inf-der (nueva ref)
        bg = dgrad(W, H, (236, 239, 241), (228, 238, 219)).convert("RGBA")
        bg = Image.alpha_composite(bg, glow(W, H, 1620, 2560, 980, (214, 231, 178), 95))
        ink = (16, 28, 18); muted = (98, 110, 98); body = (8, 10, 9)
        sh_col = (30, 45, 25, 75)
        c = bg
        rim = None
    else:
        # teal-verde profundo (ref oscura): teal inf-izq + forest sup-der sobre base oscura
        bg = dgrad(W, H, (10, 30, 30), (8, 18, 12)).convert("RGBA")
        bg = Image.alpha_composite(bg, glow(W, H, 240, 2180, 1000, (18, 132, 120), 165))
        bg = Image.alpha_composite(bg, glow(W, H, 1180, 560, 920, (44, 78, 24), 150))
        ink = (245, 248, 242); muted = (170, 188, 172); body = (4, 7, 6)
        sh_col = (0, 0, 0, 180)
        c = Image.alpha_composite(bg, glow(W, H, W // 2, 1140, 520, (60, 150, 90), 80))
        rim = (78, 104, 80)

    d = ImageDraw.Draw(c)
    cx = W // 2

    # isotipo de marca (firma)
    iso_w = 132
    iso = ISO.resize((iso_w, int(iso_w * ISO.height / ISO.width)), Image.LANCZOS)
    c.alpha_composite(iso, ((W - iso_w) // 2, 132))

    ft = ImageFont.truetype(FB, 90)
    fs = ImageFont.truetype(FM, 42)
    y = 218
    for ln in title:
        cdraw(d, cx, y, ln, ft, ink)
        y += 106
    cdraw(d, cx, y + 16, sub, fs, muted)

    dev = device(os.path.join(SRC, shot), 826, body=body)
    dw, dh = dev.size
    dx = (W - dw) // 2
    dy = 752

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    l = Image.new("RGBA", dev.size, (0, 0, 0, 0))
    l.paste(sh_col, (0, 0), rmask(dw, dh, 104))
    shadow.alpha_composite(l, (dx, dy + 36))
    shadow = shadow.filter(ImageFilter.GaussianBlur(48))
    c = Image.alpha_composite(c, shadow)
    if rim is not None:
        ImageDraw.Draw(c).rounded_rectangle(
            [dx - 1, dy - 1, dx + dw, dy + dh], radius=105, outline=rim + (255,), width=2)
    c.alpha_composite(dev, (dx, dy))

    c.convert("RGB").save(os.path.join(OUT, out_name))
    print("OK", out_name)

P = "Simulator Screenshot - iPhone 17 Pro Max - 2026-06-26 at %s.png"
SET = [
    ("01_home.png",        P % "19.19.40", ["Tu próximo", "partido te espera"],
        "Todos tus desafíos, en un solo lugar.", "light"),
    ("02_escalerilla.png", P % "17.43.18", ["Sube en", "la escalerilla"],
        "Compite, defiende tu lugar y escala posiciones.", "dark"),
    ("03_matchmaking.png", P % "19.35.24", ["Encuentra rival", "a tu nivel"],
        "Rivales cerca, listos para jugar hoy.", "light"),
    ("04_caraacara.png",   P % "19.21.41", ["Conoce tu historial", "ante cada rival"],
        "Tu cara a cara, partido a partido.", "dark"),
    ("05_perfil.png",      P % "19.20.46", ["Tus números,", "como un profesional"],
        "Win rate, forma y récord, siempre contigo.", "light"),
    ("06_scorematch.png",  P % "17.14.13", ["Analiza tu juego", "al detalle"],
        "Cada quiebre, saque y tiebreak, medido.", "dark"),
    ("07_evolucion.png",   P % "17.13.00", ["Mira cómo subes,", "semana a semana"],
        "Tu progreso, medido de verdad.", "light"),
    ("08_chat.png",        P % "19.21.31", ["Coordina tu partido", "sin fricción"],
        "Día, hora y cancha, todo por chat.", "dark"),
    ("09_desafio.png",     P % "19.42.44", ["Reserva cancha", "y desafía"],
        "Club, día y hora en segundos.", "light"),
]
for name, shot, title, sub, theme in SET:
    frame(name, shot, title, sub, theme)
