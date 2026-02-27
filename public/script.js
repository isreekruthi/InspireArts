//the whole webpage(document) will wait(using addEventListener function)
//for all HTML to load(DOMContentLoaded)exluding images and styling, to run the following code
document.addEventListener('DOMContentLoaded', () => {

  //ACCORDION IN SERVICES
  //After selecting everything labeled 'accordion-label', which is each lesson type button,
  //we use the 'forEach' loop to cycle through each lesson type. 'label' refers to the currently selected.
  document.querySelectorAll('.accordion-label').forEach(label => {
    //when the label is clicked, we check the 'forEach' loop again to ensure there's nothing else open.
    label.addEventListener('click', () => {
      document.querySelectorAll('.accordion-label').forEach(other => {
        //ensure that nothing else is open by removing the active class, removes styling
        if (other !== label) {
          other.classList.remove('active');
          //styling for the accordion contents which should be closed
          other.nextElementSibling.style.maxHeight = null;
          other.nextElementSibling.style.padding = "0 1.5em";
        }
      //close the loop that hides inactive accordions
      });

      //toggles the active class on the clicked button; visual
      label.classList.toggle('active');
      //takes the next part, or the section underneath, the label we selected. here, we are selecting the 'accordion-content'
      const content = label.nextElementSibling;
      //if the content is open(maxHeight), we close it by removing the height and padding; visually neat
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.padding = "0 1.5em";
        //if it's closed, we add height and padding
        //'px' will convert it to pixels
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.padding = "1em 1.5em";
      }
    });
  });

  //CAROUSEL IN GALLERY
  //creates buttons for next/previous with the classes defined in gallery.html
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  //puts all slides into a list called items
  const items = document.querySelectorAll('.carousel-item');
  
  //error check! if previous/next buttons exist and there is at least 1 carousel item
  if (prevBtn && nextBtn && items.length > 0) {
    //initializes a variable, 'currentIndex', for the active item; checks the 'carousel-item' list
    let currentIndex = 0;

    //shows one specific slide
    function showSlide(index) {
      //loops through each item; if it's index matches 'index', it is marked active
      //see styles.css->.carousel-item.active
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    }

    //listens for 'previous button' click
    prevBtn.addEventListener('click', () => {
      //creates a loop so the carousel doesn't get stuck at the first picture/video
      currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
      //'currentIndex' has been updated to the previous page
      showSlide(currentIndex);
    });

    //listens for the 'next button' click
    nextBtn.addEventListener('click', () => {
      //similarly, if you're on the last slide it goes back to the first one
      currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
      showSlide(currentIndex);
    });

    //when the page loads, it loads the first index, index 0
    showSlide(currentIndex);
  }

  //POPUP IN SERVICES
  //gets the button defined previously and checks for the HTML element with that id, 'openModalBtn'
  const openModalBtn = document.getElementById('openModalBtn');
  //gets the actual box element, line 91 in services.html
  const modal = document.getElementById('policyModal');

  //error check! see if both elements exist
  if (openModalBtn && modal) {
    //checks for the close/x button
    const closeModal = modal.querySelector('.close-modal');

    //checks for the button to be clicked
    openModalBtn.addEventListener('click', () => {
      //makes the modal visible
      modal.style.display = 'block';
    });

    //checks for the close button to be clicked
    closeModal.addEventListener('click', () => {
      //removes the displayed section
      modal.style.display = 'none';
    });

    //checks for the user to click outside of the box
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        //and then closes the display section
        modal.style.display = 'none';
      }
    });
  }

  //MUSICBRAINZ API
  //grabs the search button
  const searchBtn = document.getElementById("searchArtistBtn");
  //grabs the input field where the user will submit an artist name
  const artistInput = document.getElementById("artistInput");
  //grabs the empty containers for the artist list that is presented after submitting a name
  const artistList = document.getElementById("artistList");
  //grabs the empty containers for the song list presented after clicking an artist's name 
  const songList = document.getElementById("songList");

//all 4 elements previously defined must exist to execute the following
if (searchBtn && artistInput && artistList && songList) {
  //listen for the user to click on search
  searchBtn.addEventListener("click", () => {
    //when they click on search, get the value entered and trim spaces from the beginning and end
    const artistName = artistInput.value.trim();
    //clear previous artist and song results
    artistList.innerHTML = "";
    songList.innerHTML = "";

    //validation check! if no name is entered, the user is prompted and returned to the input line
    if (!artistName) {
      artistList.textContent = "Please enter an artist name.";
      return;
    }

    //shows a loading/searching message while the user waits for the API to fetch results
    artistList.textContent = "Searching...";

    //'fetch()' will request data from the MusicBrainz API
    //'encodeURIComponent' replaces the special characters that the URL cannot process correctly; eg. AC/DC, Beyoncé
    fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`)
      //converts what was retrieved from the API to usable json data
      .then(res => res.json())
      .then(data => {
        //if a matching artist is found,
        if (data.artists && data.artists.length > 0) {
          //display a heading to prompt the user
          artistList.innerHTML = "<h4>Select an artist:</h4>";
          //create an unordered list to hold clickable 'listed items'
          const ul = document.createElement("ul");

          //loop through the artists and create a list of 5
          data.artists.slice(0, 5).forEach(artist => {
            const li = document.createElement("li");
            //list the artist name and country if provided, list '?' if the country is not available
            li.textContent = `${artist.name} (${artist.country || "?"})`;
            //styling
            li.style.cursor = "pointer";
            li.style.color = "blue";
            //when the user clicks an artist, it will list their songs
            li.addEventListener("click", () => {
              fetchRecordingsForArtist(artist.id, artist.name);
            });
            //add each artist, '<li>', to the '<ul>'
            ul.appendChild(li);
          });
          artistList.appendChild(ul);
          //if no artist is found from user input, display the following message
        } else {
          artistList.textContent = "No matching artists found.";
        }
      })
      //error check! if something goes wrong in fetching data from the API, display the following message
      .catch(() => {
        artistList.textContent = "Sorry! Could not retrieve artist data.";
      });
  });

  //function takes 2 parameters, 'artistId'(readable by the API) and 'artistName'(display)
  function fetchRecordingsForArtist(artistId, artistName) {
    //sets HTML content inside 'songList' with a loading message
    songList.innerHTML = `<p>Loading songs for <strong>${artistName}</strong>...</p>`;

    //fetches up to 10('limit=10') recordings from the API, filtered by the artist's ID; 'fmt=json' ensures formatting
    fetch(`https://musicbrainz.org/ws/2/recording?artist=${artistId}&limit=10&fmt=json`)
      //waits for response and converts it to usable JSON
      .then(res => res.json())
      .then(data => {
        //if there are recordings,
        if (data.recordings && data.recordings.length > 0) {
          //'innerHTML' will clear the existing loading message and begin a list of the found recordings
          songList.innerHTML = `<h4>Songs by ${artistName}:</h4><ul>`;
          //filter out junk by removing songs wrapped in []
          //creates a new array called 'filter' which loops through the existing array, 'data.recordings'
          //the new array will only keep songs, 'r', which do NOT match the pattern
          const cleanSongs = data.recordings.filter(r => !r.title.match(/^\[.*\]$/));
          //if there are clean songs
          if (cleanSongs.length > 0) {
            cleanSongs.forEach(recording => {
              //we add each one as a 'li' to out list
              songList.innerHTML += `<li>${recording.title}</li>`;
            });
            //otherwise we display the following message
          } else {
            songList.innerHTML = "No clean songs found.";
          }
          //close the 'ul' element after printing the appropriate outputs
          songList.innerHTML += `</ul>`;
          //if no recording are found at all
        } else {
          songList.innerHTML = "No songs found.";
        }
      })
      //if there's no internet, JSON doesn't parse, API is down, etc, it shows a message to the user to indicate failure
      .catch(() => {
        songList.textContent = "Sorry! Could not fetch songs.";
      });
  }
}
});
