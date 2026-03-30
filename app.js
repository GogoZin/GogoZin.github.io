const video = document.getElementById('video');
const channelList = document.getElementById('channelList');
const currentChannel = document.getElementById('currentChannel');

const modal = document.getElementById('modalWindow');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalButtons = document.getElementById('modalButtons');

let currentPlayer = null;

// 停止目前播放器
function stopCurrentPlayer() {
    if (currentPlayer) {
        try { currentPlayer.destroy(); } catch (e) { }
        currentPlayer = null;
    }
    video.src = '';
}

// 格式偵測
async function detectStreamType(url) {
    try {
        const res = await fetch(url, {
            headers: { 'Range': 'bytes=0-2048' }
        });

        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);

        // TS
        if (bytes[0] === 0x47 && bytes[188] === 0x47) return 'ts';

        // FLV
        if (bytes[0] === 0x46 && bytes[1] === 0x4C && bytes[2] === 0x56) return 'flv';

        // MP4
        const text = new TextDecoder().decode(bytes.slice(4, 8));
        if (text === 'ftyp') return 'mp4';

        // M3U8
        const str = new TextDecoder().decode(bytes);
        if (str.includes('#EXTM3U')) return 'm3u8';

    } catch (e) {
        console.warn('偵測失敗', e);
    }

    return 'unknown';
}

// 播放主流程
async function playURL(url, name) {

    stopCurrentPlayer(); // 停止播放
    
    if (url.includes(':5050') || url.includes('lunar') || url.includes(":25461") || url.includes(':8080') || url.includes('106.107.242.199') || url.includes('tw539')) { // 切換PROXY
        var proxiedURL = 'https://iptv.tw539.com/?url=' + encodeURIComponent(url);
    } else {
        var proxiedURL = 'https://iptv.taizikeji.workers.dev/?url=' + encodeURIComponent(url);
    }

    let type = 'unknown';

    // 快速判斷
    if (url.includes('.m3u8')) type = 'm3u8';
    else if (url.includes('.ts')) type = 'ts';
    else if (url.includes('.flv')) type = 'flv';

    // 不確定再偵測
    if (type === 'unknown' && !url.includes('lunar') && !url.includes('tw539')) {
        type = await detectStreamType(proxiedURL);
    }

    console.log('播放格式:', type);

    try {
        if (type === 'm3u8') {
            playHLS(proxiedURL);
        } else if (type === 'ts') {
            playMpegTS(proxiedURL);
        } else if (type === 'flv') {
            playFLV(proxiedURL);
        } else if (type === 'mp4') {
            video.src = proxiedURL;
            video.play();
        } else {
            if (url.includes('lunar')) {
                playMpegTS(proxiedURL);
            } else if (url.includes('tw539')) {
                playFLV(proxiedURL);
            } else {
                fallbackPlay(proxiedURL);
            }
        }
    } catch (e) {
        console.error('播放錯誤 → fallback', e);
        fallbackPlay(proxiedURL);
    }

    currentChannel.textContent = name;
}

// HLS
function playHLS(url) {
    if (Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 30 });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
        currentPlayer = hls;
    } else {
        video.src = url;
        video.play();
    }
}

// TS
function playMpegTS(url) {
    if (mpegts.getFeatureList().mseLivePlayback) {
        const player = mpegts.createPlayer({
            type: 'mpegts', 
            isLive: true,
            url: url
        });
        player.attachMediaElement(video);
        player.load();
        player.play();
        currentPlayer = player;
    }
}

// FLV
function playFLV(url) {
    if (mpegts.getFeatureList().mseLivePlayback) {
        const player = mpegts.createPlayer({
            type: 'flv',
            isLive: true,
            url: url
        });
        player.attachMediaElement(video);
        player.load();
        player.play();
        currentPlayer = player;
    }
}

// fallback（保底）
function fallbackPlay(url) {
    console.warn('fallback 播放');

    try { playHLS(url); return; } catch (e) {}
    try { playMpegTS(url); return; } catch (e) {}
    try { playFLV(url); return; } catch (e) {}

    video.src = url;
    video.play();
}

// 解析 M3U
function parseM3U(m3uText) {
    const lines = m3uText.split(/\r?\n/);
    const channels = [];
    let lastInfo = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.startsWith('#EXTINF:')) {
            lastInfo = line;
        } else if (!line.startsWith('#')) {
            if (lastInfo) {
                let nameMatch = lastInfo.match(/,(.+)$/);
                let name = nameMatch ? nameMatch[1].trim() : '未知頻道';

                let groupMatch = lastInfo.match(/group-title="([^"]+)"/);
                let group = groupMatch ? groupMatch[1].trim() : '未分類';

                channels.push({ name, group, url: line });
                lastInfo = null;
            }
        }
    }

    const seen = new Set();
    return channels.filter(ch => {
        if (seen.has(ch.name)) return false;
        seen.add(ch.name);
        return true;
    });
}

// UI
function renderChannelList(channels) {
    const groups = {};
    channels.forEach(ch => {
        if (!groups[ch.group]) groups[ch.group] = [];
        groups[ch.group].push(ch);
    });

    channelList.innerHTML = '';

    for (let groupName in groups) {
        const btn = document.createElement('button');
        btn.className = 'group-btn';
        btn.textContent = groupName;
        btn.addEventListener('click', () => openModal(groupName, groups[groupName]));
        channelList.appendChild(btn);
    }
}

// Modal
function openModal(groupName, channelArray) {
    modalTitle.textContent = groupName;
    modalButtons.innerHTML = '';

    channelArray.forEach(ch => {
        const btn = document.createElement('button');
        btn.textContent = ch.name;
        btn.onclick = () => {
            playURL(ch.url, ch.name);
            closeModal();
        };
        modalButtons.appendChild(btn);
    });

    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
}

modalOverlay.onclick = closeModal;

// 載入
function loadM3U(fileName = 'tv.m3u') {
    fetch(fileName)
        .then(r => r.text())
        .then(text => renderChannelList(parseM3U(text)))
        .catch(err => console.error('M3U 讀取失敗', err));
}

if (confirm("此網路電視為開源項目\n所有直播源皆從網路獲取 如有侵權請告知下架\n另外網路電視須滿18才能觀看，確定代表您已滿18\n如未滿請關閉本頁 謝謝")) {
    loadM3U('tv.m3u');
} else {
    window.location.href = "https://tw539.com/";
}
