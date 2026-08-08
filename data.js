// Kaynak: bandirmaspor_gol_playlist.pdf (oyuncu / ülke / şarkı / not)
const PLAYER_INFO = {
  "Bartu Kulbilge":              { country: "Türkiye",   flag: "🇹🇷", artist: "The White Stripes",                      note: "Dünya çapında en ünlü stadyum anteması" },
  "Furkan Bekleviç":             { country: "Türkiye",   flag: "🇹🇷", artist: "Blur",                                    note: "Liverpool'un gerçek gol şarkısı" },
  "Akın Alkan":                  { country: "Türkiye",   flag: "🇹🇷", artist: "Red Hot Chili Peppers",                   note: "Lyon'un gerçek gol şarkısı" },
  "Yiğit Zorluer":               { country: "Türkiye",   flag: "🇹🇷", artist: "Queen",                                   note: "Klasik stadyum kutlama anteması" },
  "Ahmet Biler":                 { country: "Türkiye",   flag: "🇹🇷", artist: "Queen",                                   note: "Klasik futbol kutlama şarkısı" },
  "Burak Bekaroğlu":             { country: "Türkiye",   flag: "🇹🇷", artist: "Zombie Nation",                           note: "En çok çalınan stadyum gol anteması" },
  "Lucas Pedro Alves De Lima":   { country: "Brezilya",  flag: "🇧🇷", artist: "Shakira",                                 note: "2010 Dünya Kupası resmi şarkısı" },
  "Gani Burgaz":                 { country: "Türkiye",   flag: "🇹🇷", artist: "K'NAAN",                                  note: "2010 Dünya Kupası resmi şarkısı" },
  "Atınç Nukan":                 { country: "Türkiye",   flag: "🇹🇷", artist: "The Fratellis",                           note: "Birçok Premier Lig kulübünün gerçek gol şarkısı" },
  "Enes Aydın":                  { country: "Türkiye",   flag: "🇹🇷", artist: "Neil Diamond",                            note: "Dünya çapında stadyum sing-along klasiği", locked: true },
  "Yasin Arda Midiliç":          { country: "Türkiye",   flag: "🇹🇷", artist: "Gerry & The Pacemakers",                  note: "İkonik futbol stadyum anteması", locked: true },
  "Cédric Hountondji":           { country: "Benin",     flag: "🇧🇯", artist: "The Champs",                              note: "Klasik stadyum enerji şarkısı" },
  "Tolga Kalender":              { country: "Türkiye",   flag: "🇹🇷", artist: "DJ Ötzi",                                 note: "Avrupa stadyumlarında yaygın kutlama şarkısı" },
  "Yusuf Esendemir":             { country: "Türkiye",   flag: "🇹🇷", artist: "Robbie Williams",                         note: "İngiltere futbolunda taraftar anteması" },
  "Atalay Atçı":                 { country: "Türkiye",   flag: "🇹🇷", artist: "Magic System & Chawki",                   note: "2018 Dünya Kupası'nda Fransa'nın gol şarkısı" },
  "Dean Lico":                   { country: "Cape Verde",flag: "🇨🇻", artist: "Rosalía",                                 note: "İspanya Milli Takımı'nın gerçek gol şarkısı" },
  "Kerem Dönertaş":              { country: "Türkiye",   flag: "🇹🇷", artist: "Ricky Martin",                            note: "1998 Dünya Kupası resmi şarkısı" },
  "Yusuf Kocatürk":              { country: "Türkiye",   flag: "🇹🇷", artist: "Anastacia",                               note: "2002 Dünya Kupası döneminde dünya çapında popüler" },
  "Muhammed Gümüşkaya":          { country: "Türkiye",   flag: "🇹🇷", artist: "Ramones",                                 note: "Stadyumlarda yaygın enerjik parça", locked: true },
  "Cem Türkmen":                 { country: "Türkiye",   flag: "🇹🇷", artist: "AC/DC",                                   note: "Dünya çapında spor arenası klasiği", locked: true },
  "Abdulkadir Parmak":           { country: "Türkiye",   flag: "🇹🇷", artist: "Bon Jovi",                                note: "Stadyum sing-along klasiği" },
  "João Pedro Reis Amaral":      { country: "Portekiz",  flag: "🇵🇹", artist: "Survivor",                                note: "Dünya çapında spor kutlama klasiği" },
  "Amidou Badji":                { country: "Gine",      flag: "🇬🇳", artist: "House of Pain",                           note: "Yaygın stadyum coşku anteması" },
  "Emirhan Acar":                { country: "Türkiye",   flag: "🇹🇷", artist: "2 Unlimited",                             note: "Spor arenalarında klasik hype şarkısı" },
  "Enes Çinemre":                { country: "Türkiye",   flag: "🇹🇷", artist: "Tina Turner",                             note: "Dünya çapında spor kutlama klasiği" },
  "Rémi Mulumba":                { country: "Kongo",     flag: "🇨🇩", artist: "Baddiel, Skinner & The Lightning Seeds",  note: "İngiltere'nin ikonik futbol anteması", locked: true },
  "Gianni Bruno":                { country: "İtalya",    flag: "🇮🇹", artist: "Domenico Modugno",                        note: "İtalyan futbol kültüründe klasik kutlama şarkısı" },
  "Tümer Oruç":                  { country: "Türkiye",   flag: "🇹🇷", artist: "Fat Les",                                 note: "İngiliz futbol kültüründe klasik taraftar şarkısı" },
  "Tosin Kehinde":               { country: "Nijerya",   flag: "🇳🇬", artist: "Los Lobos",                               note: "Dünya çapında stadyum parti klasiği" },
  "Wilson Samake":               { country: "Mali",      flag: "🇲🇱", artist: "The Roots",                               note: "Yaygın alternatif stadyum versiyonu", locked: true }
};

// Stad Müzikler: maç günü akışına göre kategoriler. file adları öneridir,
// gerçek MP3'ler sunucuya /stadium/<kategoriId>/<file> yoluna yüklenecek.
const STADIUM_CATEGORIES = [
  { id: "macOncesi",  name: "Maç Öncesi" },
  { id: "isinma",     name: "Isınma" },
  { id: "devreArasi", name: "Devre Arası" },
  { id: "macSonu",    name: "Maç Sonu" }
];

const STADIUM_TRACKS = {
  macOncesi: [
    { title: "300 Violin Orchestra",        artist: "Jorge Quintero", file: "1-300-violin-orchestra.mp3" },
    { title: "Sandstorm",                   artist: "Darude", file: "2-sandstorm.mp3" },
    { title: "Lux Aeterna (Requiem for a Dream)", artist: "Clint Mansell", file: "3-lux-aeterna.mp3" }
  ],
  isinma: [
    { title: "Holigan",        artist: "Athena", file: "1-holigan.mp3" },
    { title: "Köprüaltı",      artist: "Duman",  file: "2-koprualti.mp3" },
    { title: "Bangır Bangır",  artist: "Gülşen",  file: "3-bangir-bangir.mp3" }
  ],
  devreArasi: [
    { title: "Şımarık",     artist: "Tarkan",  file: "1-simarik.mp3" },
    { title: "Düm Tek Tek", artist: "Hadise",  file: "2-dum-tek-tek.mp3" },
    { title: "Deli",        artist: "Athena",  file: "3-deli.mp3" }
  ],
  macSonu: [
    { title: "Hadi Bakalım", artist: "Sezen Aksu",   file: "1-hadi-bakalim.mp3" },
    { title: "Dönence",      artist: "Barış Manço",  file: "2-donence.mp3" },
    { title: "Eyvallah",     artist: "Duman",        file: "3-eyvallah.mp3" }
  ]
};
