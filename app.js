const API_BASE = "https://bandirma.212.47.66.6.sslip.io";

const ZIP_URLS = {
  all: "/bandirmaspor-tum-sarkilar.zip",
  tr: "/bandirmaspor-turk-oyuncular.zip",
  foreign: "/bandirmaspor-yabanci-oyuncular.zip"
};

let songs = [];
let currentGroup = "tr";
const STADIUM_GROUPS = STADIUM_CATEGORIES.map(c => c.id);

function enc(p) {
  return p.split("/").map(encodeURIComponent).join("/");
}

function turkishLower(s) {
  return s.replace(/İ/g, "i").replace(/I/g, "ı").toLocaleLowerCase("tr");
}

function formatTime(sec) {
  if (!isFinite(sec) || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

async function load() {
  const res = await fetch(API_BASE + "/manifest.json");
  const data = await res.json();

  songs = data.songs
    .map(s => {
      const info = PLAYER_INFO[s.player];
      if (!info) return null;
      return {
        player: s.player,
        file: s.file,
        country: info.country,
        flag: info.flag,
        artist: info.artist,
        note: info.note,
        locked: !!info.locked,
        songTitle: s.file.replace(/\.mp3$/i, ""),
        group: info.country === "Türkiye" ? "tr" : "foreign"
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.player.localeCompare(b.player, "tr"));

  const trCount = songs.filter(s => s.group === "tr").length;
  const foreignCount = songs.filter(s => s.group === "foreign").length;

  document.getElementById("trCount").textContent = trCount + " Oyuncu";
  document.getElementById("foreignCount").textContent = foreignCount + " Oyuncu";

  document.querySelectorAll("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => openList(btn.dataset.open));
  });
  document.getElementById("gateZipAll").addEventListener("click", () => {
    window.location.href = API_BASE + ZIP_URLS.all;
  });
  document.getElementById("backBtn").addEventListener("click", showGate);
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => setGroup(tab.dataset.group));
  });
  document.getElementById("zipBtn").addEventListener("click", () => {
    window.location.href = API_BASE + ZIP_URLS[currentGroup];
  });
  document.getElementById("search").addEventListener("input", renderList);
}

function openList(group) {
  currentGroup = group;
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("listView").classList.add("active");
  document.getElementById("search").value = "";
  syncTabs();
  renderList();
}

function showGate() {
  document.getElementById("listView").classList.remove("active");
  document.getElementById("gate").classList.remove("hidden");
}

function setGroup(group) {
  currentGroup = group;
  syncTabs();
  renderList();
}

function isStadiumGroup(group) {
  return STADIUM_GROUPS.includes(group);
}

function syncTabs() {
  const stadium = isStadiumGroup(currentGroup);
  document.getElementById("squadTabs").style.display = stadium ? "none" : "";
  document.getElementById("stadiumTabs").style.display = stadium ? "" : "none";
  document.getElementById("search").style.display = stadium ? "none" : "";
  document.getElementById("zipBtn").style.display = stadium ? "none" : "";

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.group === currentGroup);
  });

  if (stadium) {
    const cat = STADIUM_CATEGORIES.find(c => c.id === currentGroup);
    document.getElementById("topTitle").textContent = "Stad Müzikler — " + (cat ? cat.name : "");
    return;
  }
  const titles = { tr: "Türk Oyuncular", foreign: "Yabancı Oyuncular", all: "Tüm Kadro" };
  document.getElementById("topTitle").textContent = titles[currentGroup];
  document.getElementById("zipBtn").textContent =
    currentGroup === "all" ? "⬇ Tümünü İndir" : "⬇ Bu Grubu İndir";
}

function renderStadiumList() {
  const tracks = STADIUM_TRACKS[currentGroup] || [];
  document.getElementById("count").textContent = tracks.length + " ŞARKI";
  const list = document.getElementById("list");

  list.innerHTML = tracks.map((t, i) => {
    const path = currentGroup + "/" + t.file;
    const streamUrl = API_BASE + "/stadium/" + enc(path);
    const downloadUrl = API_BASE + "/stadium/download/" + enc(path);
    return `
      <div class="card">
        <div class="card-photo card-photo-empty">${t.title.charAt(0)}</div>
        <div class="card-num">${String(i + 1).padStart(2, "0")}</div>
        <div class="card-meta">
          <div class="card-player">${t.title}</div>
          <div class="card-song"><span class="artist">${t.artist}</span></div>
        </div>
        <div class="card-actions">
          <a class="dl" href="${downloadUrl}" download>⬇ İndir</a>
        </div>
        <div class="player">
          <button class="play-btn" type="button" aria-label="Oynat">
            <svg class="ic-play" viewBox="0 0 24 24" width="14" height="14"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>
            <svg class="ic-pause" viewBox="0 0 24 24" width="14" height="14" style="display:none"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/></svg>
          </button>
          <div class="seek-wrap">
            <div class="seek-hit">
              <div class="seek-track">
                <div class="seek-fill"></div>
                <div class="seek-thumb"></div>
              </div>
            </div>
            <div class="time-row">
              <span class="cur">0:00</span>
              <span class="dur">0:00</span>
            </div>
          </div>
          <audio preload="metadata" src="${streamUrl}"></audio>
        </div>
      </div>
    `;
  }).join("");

  wirePlayers(list);
}

function renderList() {
  if (isStadiumGroup(currentGroup)) {
    renderStadiumList();
    return;
  }
  const q = turkishLower(document.getElementById("search").value.trim());
  let items = currentGroup === "all" ? songs : songs.filter(s => s.group === currentGroup);
  if (q) {
    items = items.filter(s =>
      turkishLower(s.player).includes(q) ||
      turkishLower(s.songTitle).includes(q) ||
      turkishLower(s.artist).includes(q)
    );
  }

  document.getElementById("count").textContent = items.length + " ŞARKI";
  const list = document.getElementById("list");

  if (items.length === 0) {
    list.innerHTML = '<div class="empty">Sonuç bulunamadı</div>';
    return;
  }

  list.innerHTML = items.map((s, i) => {
    const path = s.player + "/" + s.file;
    const streamUrl = API_BASE + "/players/" + enc(path);
    const downloadUrl = API_BASE + "/download/" + enc(path);
    const photo = PLAYER_PHOTOS[s.player];
    const photoHtml = photo
      ? `<img class="card-photo" src="/${photo}" alt="${s.player}" loading="lazy" onerror="this.outerHTML='<div class=&quot;card-photo card-photo-empty&quot;>${s.player.charAt(0)}</div>'">`
      : `<div class="card-photo card-photo-empty">${s.player.charAt(0)}</div>`;
    const bottomHtml = s.locked ? `
        <div class="locked-row">
          <svg viewBox="0 0 24 24" width="13" height="13"><path fill="currentColor" d="M6 10V8a6 6 0 1112 0v2h1a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V11a1 1 0 011-1h1zm2 0h8V8a4 4 0 00-8 0v2z"/></svg>
          Şarkı değişecek — yakında güncellenecek
        </div>
      ` : `
        <div class="player">
          <button class="play-btn" type="button" aria-label="Oynat">
            <svg class="ic-play" viewBox="0 0 24 24" width="14" height="14"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>
            <svg class="ic-pause" viewBox="0 0 24 24" width="14" height="14" style="display:none"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/></svg>
          </button>
          <div class="seek-wrap">
            <div class="seek-hit">
              <div class="seek-track">
                <div class="seek-fill"></div>
                <div class="seek-thumb"></div>
              </div>
            </div>
            <div class="time-row">
              <span class="cur">0:00</span>
              <span class="dur">0:00</span>
            </div>
          </div>
          <audio preload="metadata" src="${streamUrl}"></audio>
        </div>
      `;
    const actionsHtml = s.locked
      ? `<span class="dl dl-locked">🔒 Kilitli</span>`
      : `<a class="dl" href="${downloadUrl}" download>⬇ İndir</a>`;
    return `
      <div class="card${s.locked ? " card-locked" : ""}">
        ${photoHtml}
        <div class="card-num">${String(i + 1).padStart(2, "0")}</div>
        <div class="card-meta">
          <div class="card-player">
            ${s.player}
            <span class="card-flag">${s.flag}</span>
            <span class="card-country">${s.country}</span>
          </div>
          <div class="card-song"><span class="artist">${s.artist}</span> — ${s.songTitle}</div>
          <div class="card-note">${s.note}</div>
        </div>
        <div class="card-actions">
          ${actionsHtml}
        </div>
        ${bottomHtml}
      </div>
    `;
  }).join("");

  wirePlayers(list);
}

function wirePlayers(list) {
  const players = Array.from(list.querySelectorAll(".player"));
  const allAudio = players.map(p => p.querySelector("audio"));

  players.forEach(player => {
    const audio = player.querySelector("audio");
    const playBtn = player.querySelector(".play-btn");
    const icPlay = player.querySelector(".ic-play");
    const icPause = player.querySelector(".ic-pause");
    const seekHit = player.querySelector(".seek-hit");
    const seekFill = player.querySelector(".seek-fill");
    const seekThumb = player.querySelector(".seek-thumb");
    const curEl = player.querySelector(".cur");
    const durEl = player.querySelector(".dur");

    let dragging = false;

    function setProgress(ratio) {
      const pct = Math.min(1, Math.max(0, ratio)) * 100 + "%";
      seekFill.style.width = pct;
      seekThumb.style.left = pct;
    }

    function ratioFromEvent(evt) {
      const rect = seekHit.getBoundingClientRect();
      const x = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
      return x / rect.width;
    }

    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        allAudio.forEach(a => { if (a !== audio) a.pause(); });
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => {
      player.classList.add("playing");
      icPlay.style.display = "none";
      icPause.style.display = "";
    });
    audio.addEventListener("pause", () => {
      player.classList.remove("playing");
      icPlay.style.display = "";
      icPause.style.display = "none";
    });
    audio.addEventListener("ended", () => {
      player.classList.remove("playing");
      icPlay.style.display = "";
      icPause.style.display = "none";
    });
    audio.addEventListener("loadedmetadata", () => {
      durEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      if (dragging) return;
      curEl.textContent = formatTime(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });

    function seekStart(evt) {
      dragging = true;
      player.classList.add("seeking");
      seekMove(evt);
      window.addEventListener("pointermove", seekMove);
      window.addEventListener("pointerup", seekEnd);
    }
    function seekMove(evt) {
      const ratio = Math.min(1, Math.max(0, ratioFromEvent(evt)));
      setProgress(ratio);
      curEl.textContent = formatTime(ratio * (audio.duration || 0));
    }
    function seekEnd(evt) {
      dragging = false;
      player.classList.remove("seeking");
      const ratio = Math.min(1, Math.max(0, ratioFromEvent(evt)));
      if (audio.duration) audio.currentTime = ratio * audio.duration;
      window.removeEventListener("pointermove", seekMove);
      window.removeEventListener("pointerup", seekEnd);
    }
    seekHit.addEventListener("pointerdown", seekStart);
  });
}

load().catch(err => {
  document.getElementById("list").innerHTML =
    '<div class="empty">Yükleme hatası: ' + err.message + "</div>";
});
