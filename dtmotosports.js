const iframe = document.getElementById('vidio');
const offlineMessage = document.getElementById('offline-message');
const switcher = document.querySelector('.video-switcher');
let videoList = [];

function populateVideoOptions(activeUrl) {
    switcher.innerHTML = '';
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔁 Muat Ulang Daftar';
    refreshBtn.className = 'card-button refresh';
    refreshBtn.addEventListener('click', fetchVideoList);
    switcher.appendChild(refreshBtn);
    videoList.forEach(video => {
        const btn = document.createElement('button');
        btn.textContent = video.title;
        btn.className = 'card-button';
        if (video.url === activeUrl) btn.classList.add('active');

        btn.addEventListener('click', () => {
            document.querySelectorAll('.video-switcher button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateVideoSource(video.url);
        });

        switcher.appendChild(btn);
    });
}

function updateVideoSource(url) {
    const loader = document.createElement('div');
    loader.textContent = 'Memuat video...';
    loader.style.cssText = 'text-align:center;padding:10px;color:#ff003c;';
    iframe.before(loader);
    iframe.style.opacity = '0.3';
    iframe.src = url;
    iframe.onload = () => {
        loader.remove();
        iframe.style.opacity = '1';
    };
}

function updateOnlineStatus() {
    if (!navigator.onLine) {
        offlineMessage.classList.add('show');
        iframe.style.filter = 'grayscale(0.7)';
        iframe.style.pointerEvents = 'none';
    } else {
        offlineMessage.classList.remove('show');
        iframe.style.filter = 'none';
        iframe.style.pointerEvents = 'auto';
    }
}

async function fetchVideoList() {
    try {
        const response = await fetch('https://wartakita.github.io/motosports.github.io/video.json');
        videoList = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const file = urlParams.get('motoplus');
        const defaultUrl = file || videoList[0]?.url || '';

        populateVideoOptions(defaultUrl);
        updateVideoSource(defaultUrl);
    } catch (e) {
        console.error('Gagal memuat daftar video', e);
        switcher.innerHTML = '<p style="color:#ff003c;text-align:center">Tidak dapat memuat daftar video.</p>';
    }

    updateOnlineStatus();
}

window.addEventListener('load', fetchVideoList);
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function retryIframe() {
    iframe.src = iframe.src;
}
