const songs = [
    {
        title: "Dooron Dooron",
        artist: "Paresh Pahuja",
        image: "./Image/Dooron Dooron.jpg",
        song: "./Music/Dooron.mp3"
    },
    {
        title: "Khat Meri Banogi Kya",
        artist: "Vishal Mishra",
        image: "./Image/Khat Meri Banogi Kya.jpg",
        song: "./Music/Khat.mp3"
    },
    {
        title: "MAAZ",
        artist: "Sambata",
        image: "./Image/MAAZ.jpg",
        song: "./Music/MAAZ.mp3"
    },
    {
        title: "Tu Hi Mera",
        artist: "Pritam, Shafqat Amanat Ali",
        image: "./Image/tu hi mera.jpg",
        song: "./Music/Mera.mp3"
    },
    {
        title: "Ye Tune Kya Kiya",
        artist: "Javed Bashir",
        image: "./Image/yeh_tune_kya_kiya.jpg",
        song: "./Music/Kiya.mp3"
    },
    {
        title: "Safar",
        artist: "Bayaan & Sherazam",
        image: "./Image/safar.jpg",
        song: "./Music/safar.mp3"
    },
    {
        title: "Finding Her",
        artist: "Kushagra Vanshika Kashyap Bharat ",
        image: "./Image/love.jpg",
        song: "./Music/Finding Her.mp3"
    },
    {
        title: "Tere Naina",
        artist: "Shankar Mahadevan",
        image: "./Image/naina2.jpg",
        song: "./Music/Tere Naina.mp3"
    },
    {
        title: "Unko Bhi",
        artist: "Sursediltak",
        image: "./Image/Unko.gif",
        song: "./Music/Unko Bhi Humse Mohabbat.mp3"
    },
    {
        title: "DIL NU",
        artist: "AP DHILLON",
        image: "./Image/DilNu.gif",
        song: "./Music/DIL NU.mp3"
    }
];

// ======================
// DOM Elements
// ======================

const play = document.querySelector("#play");
const next = document.querySelector("#next");
const back = document.querySelector("#back");
const repeatBtn = document.querySelector("#repeat");
const muteBtn = document.querySelector("#mute");
const cover = document.querySelector(".cover");
const main = document.querySelector("main");
const audio = document.querySelector("#audio");
const progress = document.querySelector(".progress");

const currentTimeEl = document.querySelector("#currentTime");
const durationEl = document.querySelector("#duration");

const title = document.querySelector(".song-info h2");
const artist = document.querySelector(".song-info p");

const iconPlay = play.querySelector(".icon-play");
const iconPause = play.querySelector(".icon-pause");
const iconVolOn = muteBtn.querySelector(".icon-vol-on");
const iconVolOff = muteBtn.querySelector(".icon-vol-off");

// ======================
// Variables
// ======================

let currentSong = Math.floor(Math.random() * songs.length);

// repeatMode: "off" | "all" | "one"
let repeatMode = "off";

// ======================
// Helpers
// ======================

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";//
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function setPlayIcon(isPlaying) {
    iconPlay.style.display = isPlaying ? "none" : "block";
    iconPause.style.display = isPlaying ? "block" : "none";
}

function setMuteIcon(isMuted) {
    iconVolOn.style.display = isMuted ? "none" : "block";
    iconVolOff.style.display = isMuted ? "block" : "none";
}

// ======================
// Load Song
// ======================

function loadSong() {

    const song = songs[currentSong];

    cover.style.backgroundImage = `url("${song.image}")`;
    main.style.setProperty("--bg-image", `url("${song.image}")`);

    title.textContent = song.title;
    artist.textContent = song.artist;

    audio.src = song.song;
    audio.load();
}

loadSong();

// ======================
// Metadata / Progress / Time
// ======================

audio.addEventListener("loadedmetadata", () => {
    progress.max = audio.duration;
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progress.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
});

// ======================
// Play / Pause
// ======================

play.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        setPlayIcon(true);
    } else {
        audio.pause();
        setPlayIcon(false);
    }
});

// ======================
// Next Song
// ======================

function nextSong() {
    currentSong++;
    if (currentSong >= songs.length) {
        currentSong = 0;
    }
    loadSong();
    audio.play();
    setPlayIcon(true);
}

// ======================
// Previous Song
// ======================

function previousSong() {
    currentSong--;
    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }
    loadSong();
    audio.play();
    setPlayIcon(true);
}

// ======================
// Repeat
// ======================

function cycleRepeat() {
    if (repeatMode === "off") {
        repeatMode = "all";
        repeatBtn.classList.add("active");
        repeatBtn.classList.remove("repeat-one");
    } else if (repeatMode === "all") {
        repeatMode = "one";
        repeatBtn.classList.add("active", "repeat-one");
    } else {
        repeatMode = "off";
        repeatBtn.classList.remove("active", "repeat-one");
    }
}
repeatBtn.addEventListener("click", cycleRepeat);

// Handle song end based on repeat mode
audio.addEventListener("ended", () => {
    if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
        setPlayIcon(true);
    } else if (repeatMode === "all") {
        nextSong();
    } else {
        // "off": stop after last song, otherwise go to next
        if (currentSong === songs.length - 1) {
            setPlayIcon(false);
        } else {
            nextSong();
        }
    }
});

// ======================
// Mute
// ======================

muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    setMuteIcon(audio.muted);
});

// ======================
// Keyboard Shortcuts
// ======================

document.addEventListener("keydown", (e) => {
    // Ignore if focus is on a slider (avoid double-handling arrow keys)
    if (e.target.tagName === "INPUT") return;

    switch (e.code) {
        case "Space":
            e.preventDefault();
            play.click();
            break;
        case "ArrowRight":
            nextSong();
            break;
        case "ArrowLeft":
            previousSong();
            break;
        case "ArrowUp":
            e.preventDefault();
            audio.volume = Math.min(1, audio.volume + 0.1);
            audio.muted = false;
            setMuteIcon(false);
            break;
        case "ArrowDown":
            e.preventDefault();
            audio.volume = Math.max(0, audio.volume - 0.1);
            setMuteIcon(audio.volume === 0);
            break;
    }
});

// ======================
// Event Listeners
// ======================

next.addEventListener("click", nextSong);
back.addEventListener("click", previousSong);

