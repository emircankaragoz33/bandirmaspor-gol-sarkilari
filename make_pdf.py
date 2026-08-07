# -*- coding: utf-8 -*-
from fpdf import FPDF

rows = [
("Bartu Kulbilge","TR","Seven Nation Army","The White Stripes",""),
("Furkan Bekleviç","TR","Song 2","Blur",""),
("Akın Alkan","TR","Can't Stop","Red Hot Chili Peppers",""),
("Yiğit Zorluer","TR","Don't Stop Me Now","Queen",""),
("Ahmet Biler","TR","We Are The Champions","Queen",""),
("Burak Bekaroğlu","TR","Kernkraft 400","Zombie Nation",""),
("Lucas Pedro Alves De Lima","Brezilya","Waka Waka","Shakira",""),
("Gani Burgaz","TR","Wavin' Flag","K'NAAN",""),
("Atınç Nukan","TR","Chelsea Dagger","The Fratellis",""),
("Enes Aydın","TR","Sweet Caroline","Neil Diamond","KİLİTLİ"),
("Yasin Arda Midiliç","TR","You'll Never Walk Alone","Gerry & The Pacemakers","KİLİTLİ"),
("Cédric Hountondji","Benin","Tequila","The Champs",""),
("Tolga Kalender","TR","Hey Baby","DJ Ötzi",""),
("Yusuf Esendemir","TR","Angels","Robbie Williams",""),
("Atalay Atçı","TR","Magic In The Air","Magic System & Chawki",""),
("Dean Lico","Cape Verde","Despechá","Rosalía",""),
("Kerem Dönertaş","TR","La Copa De La Vida","Ricky Martin",""),
("Yusuf Kocatürk","TR","Boom","Anastacia",""),
("Muhammed Gümüşkaya","TR","Blitzkrieg Bop","Ramones","KİLİTLİ"),
("Cem Türkmen","TR","Thunderstruck","AC/DC","KİLİTLİ"),
("Abdulkadir Parmak","TR","Livin' On A Prayer","Bon Jovi",""),
("João Pedro Reis Amaral","Portekiz","Eye Of The Tiger","Survivor",""),
("Amidou Badji","Gine","Jump Around","House of Pain",""),
("Emirhan Acar","TR","Get Ready For This","2 Unlimited",""),
("Enes Çinemre","TR","Simply The Best","Tina Turner",""),
("Rémi Mulumba","Kongo","Three Lions","Baddiel, Skinner & The Lightning Seeds","KİLİTLİ"),
("Gianni Bruno","İtalya","Volare","Domenico Modugno",""),
("Tümer Oruç","TR","Vindaloo","Fat Les",""),
("Tosin Kehinde","Nijerya","La Bamba","Los Lobos",""),
("Wilson Samake","Mali","Seven Nation Army (Remix)","The Roots","KİLİTLİ"),
]

def fix(s):
    return s.encode('latin-1', 'replace').decode('latin-1')

pdf = FPDF(orientation="L", unit="mm", format="A4")
pdf.add_page()
pdf.set_font("Helvetica", "B", 16)
pdf.cell(0, 10, fix("Bandırmaspor Gol Şarkıları - Kılavuz"), ln=1)
pdf.set_font("Helvetica", "", 9)
pdf.set_fill_color(101, 25, 39)
pdf.set_text_color(255, 255, 255)
widths = [55, 25, 65, 65, 25]
heads = ["Oyuncu", "Ülke", "Şarkı", "Sanatçı", "Durum"]
for w, h in zip(widths, heads):
    pdf.cell(w, 8, fix(h), border=1, fill=True)
pdf.ln()
pdf.set_text_color(0, 0, 0)
for r in rows:
    fill = r[4] == "KİLİTLİ"
    pdf.set_fill_color(230, 221, 201) if fill else None
    for w, val in zip(widths, r):
        pdf.cell(w, 7, fix(val), border=1, fill=fill)
    pdf.ln()

pdf.output(r"C:\Users\Emircan Karagöz\Desktop\bandirmaspor_kilavuz.pdf")
print("done")
