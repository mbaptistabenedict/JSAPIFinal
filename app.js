async function fetchAPI(endpoint) {
  const response = await fetch(endpoint);
  return await response.json();
}

function displayResults(containerId, data, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (data.results && data.results.length > 0) {
    data.results.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("result-item");

      if (type === "character") {
        itemDiv.innerHTML = `
                <div class="item__wrapper">
                    <h3>${item.name}</h3>
                    <p>Status: ${item.status}</p>
                    <p>Species: ${item.species}</p>
                </div>
                    <img src="${item.image}" alt="${item.name}" width="100">
                    
                `;
      } else if (type === "episode") {
        itemDiv.innerHTML = `
                <div class="item__wrapper"
                    <h3>${item.name}</h3>
                    <p>Air Date: ${item.air_date}</p>
                    <p>Episode: ${item.episode}</p>
                </div>    
                `;
      } else if (type === "location") {
        itemDiv.innerHTML = `
                <div class="item-wrapper">
                    <h3>${item.name}</h3>
                    <p>Type: ${item.type}</p>
                    <p>Dimension: ${item.dimension}</p>
                </div>    
                `;
      }

      container.appendChild(itemDiv);
    });
  } else {
    container.innerHTML = `<p>No results found.</p>`;
  }
}

function showContainer(containerId) {
  document.getElementById(containerId).classList.remove("hidden");
}

function toggleSkeletonLoader(containerId, show) {
  const skeletonLoader = document.getElementById(containerId);
  const content = skeletonLoader.nextElementSibling; // The results div

  if (show) {
    skeletonLoader.classList.add("fade-in");
    skeletonLoader.classList.remove("fade-out");
    content.classList.add("hidden");
  } else {
    skeletonLoader.classList.add("fade-out");
    skeletonLoader.classList.remove("fade-in");
    content.classList.remove("hidden", "fade-out");
    content.classList.add("fade-in");
  }
}

async function searchCharacters() {
  const name = document.getElementById("characterInput").value;
  if (name) {
    showContainer("characterResultsContainer");
    toggleSkeletonLoader("characterSkeletonLoader", true);

    setTimeout(async () => {
      const data = await fetchAPI(
        `https://rickandmortyapi.com/api/character?name=${name}`
      );
      displayResults("characterResults", data, "character");
      toggleSkeletonLoader("characterSkeletonLoader", false);
    }, 2000);
  }
}

async function searchEpisodes() {
  const name = document.getElementById("episodeInput").value;
  if (name) {
    showContainer("episodeResultsContainer");
    toggleSkeletonLoader("episodeSkeletonLoader", true);

    setTimeout(async () => {
      const data = await fetchAPI(
        `https://rickandmortyapi.com/api/episode?name=${name}`
      );
      displayResults("episodeResults", data, "episode");
      toggleSkeletonLoader("episodeSkeletonLoader", false);
    }, 2000);
  }
}

async function searchLocations() {
  const name = document.getElementById("locationInput").value;
  if (name) {
    showContainer("locationResultsContainer");
    toggleSkeletonLoader("locationSkeletonLoader", true);

    setTimeout(async () => {
      const data = await fetchAPI(
        `https://rickandmortyapi.com/api/location?name=${name}`
      );
      displayResults("locationResults", data, "location");
      toggleSkeletonLoader("locationSkeletonLoader", false);
    }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("characterInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchCharacters();
        }
    });

    document.getElementById("episodeInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchEpisodes();
        }
    });

    document.getElementById("locationInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchLocations();
        }
    });
});

// Function to copy text to clipboard and show confirmation message
function copyToClipboard(text, item) {
    navigator.clipboard.writeText(text).then(() => {
        // Show copy confirmation message
        const copyMessage = document.getElementById("copyMessage");
        copyMessage.classList.add("visible");
        copyMessage.textContent = `"${text}" copied to clipboard!`;

        // Remove the 'copied' class from all items before adding it to the clicked item
        document.querySelectorAll(".character-item").forEach(el => el.classList.remove("copied"));
        // Highlight the copied item with a green background
        item.classList.add("copied");

        // Hide the message after 2 seconds
        setTimeout(() => {
            copyMessage.classList.remove("visible");
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

// Function to paste text from clipboard into a clicked input field
function pasteFromClipboard(event) {
    navigator.clipboard.readText().then(text => {
        if (text) {
            event.target.value = text;
        } else {
            console.log("No text found in clipboard.");
        }
    }).catch(err => {
        console.error("Failed to read clipboard content: ", err);
    });
}

// Event listener for each character item in the list
document.addEventListener("DOMContentLoaded", () => {
    const characterItems = document.querySelectorAll(".character-item");

    characterItems.forEach(item => {
        item.addEventListener("click", () => {
            const characterName = item.getAttribute("data-name");
            copyToClipboard(characterName, item);
        });
    });

    // Event listeners for pasting into each of the input fields
    const pasteInputs = ["characterInput", "episodeInput", "locationInput"];
    pasteInputs.forEach(inputId => {
        const inputField = document.getElementById(inputId);
        inputField.addEventListener("click", pasteFromClipboard);
    });
});




