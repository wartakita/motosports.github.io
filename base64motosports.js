function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

function generateEmbed() {
    let inputUrl = document.getElementById('inputEmbed').value;
    if (!isValidURL(inputUrl)) {
        alert("Masukkan URL yang valid!");
        return;
    }
    let base64Encoded = btoa(inputUrl);
    document.getElementById('embedLink').href = `https://embedmotosports.blogspot.com/?embed=${base64Encoded}`;
    document.getElementById('embedLink').innerText = document.getElementById('embedLink').href;
}

function generateHLS() {
    let inputUrl = document.getElementById('inputHLS').value;
    if (!isValidURL(inputUrl)) {
        alert("Masukkan URL yang valid!");
        return;
    }
    let base64Encoded = btoa(inputUrl);
    document.getElementById('hlsLink').href = `https://hlsminton.blogspot.com/?video=${base64Encoded}`;
    document.getElementById('hlsLink').innerText = document.getElementById('hlsLink').href;
}

function copyToClipboard(elementId) {
    let link = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(link).then(() => {
        alert("Tautan berhasil disalin!");
    }).catch(() => {
        alert("Gagal menyalin tautan");
    });
}

function resetEmbed() {
    document.getElementById('inputEmbed').value = "";
    document.getElementById('embedLink').innerText = "";
    document.getElementById('embedLink').href = "";
}

function resetHLS() {
    document.getElementById('inputHLS').value = "";
    document.getElementById('hlsLink').innerText = "";
    document.getElementById('hlsLink').href = "";
}
