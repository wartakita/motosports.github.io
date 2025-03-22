document.getElementById("searchInput").addEventListener("keyup", function() {
    let filter = this.value.toLowerCase();
    let matchItems = document.querySelectorAll(".match-item");
    let noResults = document.getElementById("noResults");
    let found = false;

    matchItems.forEach(item => {
        let title = item.querySelector(".card-title").textContent.toLowerCase();
        if (title.includes(filter)) {
            item.style.display = "block";
            found = true;
        } else {
            item.style.display = "none";
        }
    });

    if (!found) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }
});

document.getElementById("leagueFilter").addEventListener("change", function() {
    let selectedLeague = this.value;
    let matchItems = document.querySelectorAll(".match-item");
    let noResults = document.getElementById("noResults");
    let found = false;

    matchItems.forEach(item => {
        let league = item.getAttribute("data-league");
        if (selectedLeague === "" || league === selectedLeague) {
            item.style.display = "block";
            found = true;
        } else {
            item.style.display = "none";
        }
    });

    if (!found) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }
});

function updateMatchStatus() {
    let liveMatchList = document.getElementById('liveMatchList');
    let upcomingMatchList = document.getElementById('upcomingMatchList');
    let matchItems = document.querySelectorAll(".match-item");
    let now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour12: false
    });

    liveMatchList.innerHTML = '';
    upcomingMatchList.innerHTML = '';

    matchItems.forEach(item => {
        let startTime = new Date(item.getAttribute("data-start-time")).toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
            hour12: false
        });
        let duration = parseInt(item.getAttribute("data-duration"), 10);
        let endTime = new Date(new Date(startTime).getTime() + duration * 60 * 1000).toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
            hour12: false
        });

        let liveLabel = item.querySelector(".live-label");
        let matchDateElement = item.querySelector(".match-date");

        let nowTime = new Date(now).getTime();
        let startTimeTime = new Date(startTime).getTime();
        let endTimeTime = new Date(endTime).getTime();

        // Format match date
        let matchDate = new Date(startTime).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        matchDateElement.textContent = matchDate;

        if (nowTime < startTimeTime) {
            // Match has not started yet
            if (liveLabel) {
                liveLabel.remove();
            }
            upcomingMatchList.appendChild(item);
        } else if (nowTime >= startTimeTime && nowTime < endTimeTime) {
            // Match is live
            if (!liveLabel) {
                liveLabel = document.createElement("span");
                liveLabel.className = "live-label";
                liveLabel.textContent = "LIVE";
                item.querySelector(".match-card").appendChild(liveLabel);
            }
            liveMatchList.appendChild(item);
        } else {
            // Match is finished
            item.style.display = "none";
        }
    });

    // Hide sections if no matches are found
    if (liveMatchList.children.length === 0) {
        document.getElementById('liveMatchesSection').style.display = 'none';
    } else {
        document.getElementById('liveMatchesSection').style.display = 'block';
    }

    if (upcomingMatchList.children.length === 0) {
        document.getElementById('upcomingMatchesSection').style.display = 'none';
    } else {
        document.getElementById('upcomingMatchesSection').style.display = 'block';
    }
}

setInterval(updateMatchStatus, 1000);
updateMatchStatus(); // Initial call to set the status immediately

// Fetch matches from JSON file
async function fetchMatches() {
    try {
        const response = await fetch('https://wartakita.github.io/motosports.github.io/matches.json');
        const matches = await response.json();
        const liveMatchList = document.getElementById('liveMatchList');
        const upcomingMatchList = document.getElementById('upcomingMatchList');
        const leagueFilter = document.getElementById('leagueFilter');
        liveMatchList.innerHTML = ''; // Clear existing content
        upcomingMatchList.innerHTML = ''; // Clear existing content
        leagueFilter.innerHTML = '<option value="">Semua Liga</option>'; // Clear existing options

        // Collect unique leagues
        const uniqueLeagues = new Set(matches.map(match => match.league));

        // Populate league filter
        uniqueLeagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league;
            option.textContent = league;
            leagueFilter.appendChild(option);
        });

        matches.forEach(match => {
            const matchItem = document.createElement('div');
            matchItem.className = 'col-md-4 match-item';
            matchItem.setAttribute('data-league', match.league);
            matchItem.setAttribute('data-start-time', match.start_time);
            matchItem.setAttribute('data-duration', match.duration);

            matchItem.innerHTML = `
                        <div class="card match-card">
                            <span class="league-label">${match.league.toUpperCase()}</span>
                            <span class="match-date"></span>
                            <img src="${match.thumbnail}" class="card-img-top" alt="Match Thumbnail">
                            <div class="card-body text-center">
                                <h5 class="card-title">${match.title}</h5>
                                <a href="${match.watch_url}" class="btn btn-primary">
                                    <i class="fas fa-play-circle"></i> Tonton Sekarang
                                </a>
                                <div class="mt-2">
                                    <button class="btn btn-outline-primary btn-sm share-btn" data-title="${match.title}" data-url="${match.watch_url}">
                                        <i class="fas fa-share-alt"></i> Bagikan
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

            // Append to respective sections
            if (new Date(match.start_time).getTime() <= new Date().getTime() && new Date(match.start_time).getTime() + match.duration * 60 * 1000 > new Date().getTime()) {
                liveMatchList.appendChild(matchItem);
            } else {
                upcomingMatchList.appendChild(matchItem);
            }
        });

        updateMatchStatus(); // Update match status after fetching data
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
}

fetchMatches();

// Scroll to top functionality
const scrollToTopButton = document.getElementById('scrollToTop');

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopButton.style.display = "block";
    } else {
        scrollToTopButton.style.display = "none";
    }
};

scrollToTopButton.onclick = function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
};

// Share functionality
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('share-btn')) {
        const title = event.target.getAttribute('data-title');
        const url = event.target.getAttribute('data-url');

        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).then(() => {
                console.log('Berhasil dibagikan');
            }).catch((error) => {
                console.error('Gagal membagikan:', error);
            });
        } else {
            // Fallback for browsers that do not support Web Share API
            navigator.clipboard.writeText(url).then(() => {
                alert('Tautan telah disalin ke clipboard: ' + url);
            }).catch((error) => {
                console.error('Gagal menyalin tautan:', error);
            });
        }
    }
});
