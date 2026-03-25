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

// 判斷 URL 類型
function isM3U8(url) { return url.toLowerCase().includes('.m3u8'); }
function isTS(url) { return url.toLowerCase().includes('.ts'); }

// 播放 URL
function playURL(url, name) {
    stopCurrentPlayer();
    const proxiedURL = 'https://iptv.taizikeji.workers.dev/?url=' + encodeURIComponent(url);

    if (isM3U8(url)) {
        if (Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 30 });
            hls.loadSource(proxiedURL);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
            currentPlayer = hls;
        } else {
            video.src = proxiedURL;
            video.play();
        }
    } else if (isTS(url)) {
        if (mpegts.getFeatureList().mseLivePlayback) {
            const player = mpegts.createPlayer({ type: 'flv', isLive: true, url: proxiedURL });
            player.attachMediaElement(video);
            player.load();
            player.play();
            currentPlayer = player;
        } else {
            alert('此瀏覽器不支援 TS 播放');
        }
    } else {
        if (Hls.isSupported()) {
            const hls = new Hls({ maxBufferLength: 30 });
            hls.loadSource(proxiedURL);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
            currentPlayer = hls;
        } else {
            video.src = proxiedURL;
            video.play();
        }
    }

    currentChannel.textContent = name;
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

    // 過濾重複頻道名
    const seen = new Set();
    return channels.filter(ch => {
        if (seen.has(ch.name)) return false;
        seen.add(ch.name);
        return true;
    });
}

// 渲染頻道列表（群組按鈕）
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

// 打開浮動窗口
function openModal(groupName, channelArray) {
    modalTitle.textContent = groupName;
    modalButtons.innerHTML = '';

    channelArray.forEach(ch => {
        const btn = document.createElement('button');
        btn.textContent = ch.name;
        btn.addEventListener('click', () => {
            playURL(ch.url, ch.name);
            closeModal();
        });
        modalButtons.appendChild(btn);
    });

    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
}

// 關閉浮動窗口
function closeModal() {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
}

// 點擊遮罩關閉
modalOverlay.addEventListener('click', closeModal);

// 從同路徑 M3U 讀取
function loadM3U(fileName = 'tv.m3u') {
    fetch(fileName)
        .then(resp => resp.text())
        .then(text => {
            const channels = parseM3U(text);
            renderChannelList(channels);
        })
        .catch(err => console.error('讀取 M3U 失敗', err));
}

// 初始化
loadM3U('tv.m3u');