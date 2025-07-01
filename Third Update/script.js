document.addEventListener('DOMContentLoaded', () => {
  // Accordion in Services
  document.querySelectorAll('.accordion-label').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('.accordion-label').forEach(other => {
        if (other !== label) {
          other.classList.remove('active');
          other.nextElementSibling.style.maxHeight = null;
          other.nextElementSibling.style.padding = "0 1.5em";
        }
      });

      label.classList.toggle('active');
      const content = label.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.padding = "0 1.5em";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.padding = "1em 1.5em";
      }
    });
  });

  // Carousel in Gallery
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const items = document.querySelectorAll('.carousel-item');
  if (prevBtn && nextBtn && items.length > 0) {
    let currentIndex = 0;

    function showSlide(index) {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
      showSlide(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
      showSlide(currentIndex);
    });

    showSlide(currentIndex);
  }

  // PopUp in Services
  const openModalBtn = document.getElementById('openModalBtn');
  const modal = document.getElementById('policyModal');

  if (openModalBtn && modal) {
    const closeModal = modal.querySelector('.close-modal');

    openModalBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // API
  const searchBtn = document.getElementById("searchArtistBtn");
  const artistInput = document.getElementById("artistInput");
  const artistList = document.getElementById("artistList");
  const songList = document.getElementById("songList");

if (searchBtn && artistInput && artistList && songList) {
  searchBtn.addEventListener("click", () => {
    const artistName = artistInput.value.trim();
    artistList.innerHTML = "";
    songList.innerHTML = "";

    if (!artistName) {
      artistList.textContent = "Please enter an artist name.";
      return;
    }

    artistList.textContent = "Searching...";

    fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`)
      .then(res => res.json())
      .then(data => {
        if (data.artists && data.artists.length > 0) {
          artistList.innerHTML = "<h4>Select an artist:</h4>";
          const ul = document.createElement("ul");

          data.artists.slice(0, 5).forEach(artist => {
            const li = document.createElement("li");
            li.textContent = `${artist.name} (${artist.country || "?"})`;
            li.style.cursor = "pointer";
            li.style.color = "blue";
            li.addEventListener("click", () => {
              fetchRecordingsForArtist(artist.id, artist.name);
            });
            ul.appendChild(li);
          });

          artistList.appendChild(ul);
        } else {
          artistList.textContent = "No matching artists found.";
        }
      })
      .catch(() => {
        artistList.textContent = "Sorry! Could not retrieve artist data.";
      });
  });

  function fetchRecordingsForArtist(artistId, artistName) {
    songList.innerHTML = `<p>Loading songs for <strong>${artistName}</strong>...</p>`;

    fetch(`https://musicbrainz.org/ws/2/recording?artist=${artistId}&limit=10&fmt=json`)
      .then(res => res.json())
      .then(data => {
        if (data.recordings && data.recordings.length > 0) {
          songList.innerHTML = `<h4>Songs by ${artistName}:</h4><ul>`;
          //filter out junk
          const cleanSongs = data.recordings.filter(r => !r.title.match(/^\[.*\]$/));
          if (cleanSongs.length > 0) {
            cleanSongs.forEach(recording => {
              songList.innerHTML += `<li>${recording.title}</li>`;
            });
          } else {
            songList.innerHTML = "No clean songs found.";
          }

          songList.innerHTML += `</ul>`;
        } else {
          songList.innerHTML = "No songs found.";
        }
      })
      .catch(() => {
        songList.textContent = "Sorry! Could not fetch songs.";
      });
  }
}
});
