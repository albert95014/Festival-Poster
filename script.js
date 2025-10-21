const CLIENT_ID = "233100eb3af84085b5818cd4558b46c2"
const SPOTIFY_AUTHORIZE_ENDPOINT = new URL("https://accounts.spotify.com/authorize")
// const REDIRECT_URI_AFTER_LOGIN = "http://localhost:8080/index.html"
// const REDIRECT_URI_AFTER_LOGIN = "http://127.0.0.1:8080/index.html"
const REDIRECT_URI_AFTER_LOGIN = "https://albert95014.github.io/Festival-Poster"
const SPACE_DELIMITER = "%20"
const SCOPES = ["user-top-read"]
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER)

const TOP_ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=30"
var signInState = false;

function checkSignInState() {
  if (signInState == false) {
    document.getElementById("notSignedIn").style.visibility = "visible";
    document.getElementById("signedIn").style.visibility = "hidden";
  } else if (signInState == true) {
    document.getElementById("notSignedIn").style.visibility = "hidden";
    document.getElementById("signedIn").style.visibility = "visible";
  }
}

function getReturnedParamsFromSpotifyAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');

  console.log(code)
  getToken(code).then(access_token => {
    console.log(access_token)

    spotifyGetArtists(access_token);
  });
}

const spotifyGetArtists = async (accessToken) => {
  console.log("Successful Access Token: " + accessToken)

  try {
    const response = await fetch(TOP_ARTISTS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        console.error("Spotify API Error:", errorData);
        throw new Error(`${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Successful API Response:", data);
      artistNames = [];
      artistLinks = [];
      artistImages = [];
      // setData(response.data);
      // console.log(response.data.items.length);
      for (const artist of data.items) {
        artistNames.push(artist.name);
        artistLinks.push(artist.external_urls.spotify);
        artistImages.push(artist.images[2].url)
      }
      // console.log(artistNames);
      // console.log(response.data.items);
      // console.log(artistLinks);
      // console.log(artistImages);

      createArtistLinks();
      start();

      signInState = true;
      checkSignInState();
      

      } catch (error) {
        console.error("Fetch error:", error);
      }
}

const getToken = async code => {

  // stored in the previous step
  const codeVerifier = localStorage.getItem('code_verifier');

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI_AFTER_LOGIN,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const response = await body.json();
  console.log('Spotify token response:', response);
  console.log(response.access_token)

  localStorage.setItem('access_token', response.access_token);

  return response.access_token;
}
//----------------------------------------------------------------------------------

function enableSaveButton() {
  document.getElementById("saveButton").disabled = false;
}

function createArtistLinks() {
  var artistList = document.createElement("ul");

  index = 0;
  for (var artist in artistNames) {
    artistListItem = document.createElement("li");
    artistListItem.innerHTML = "<a href='" + artistLinks[index] + "' target='_blank'>" + 
                                "<img src='" + 
                                artistImages[index] +
                                "'<p>" + 
                                artistNames[index] + 
                                "</p></a>";
    artistList.appendChild(artistListItem);
    index += 1;
  }

  artistLinksContainer = document.getElementById("artistLinksContainer");
  artistLinksContainer.appendChild(artistList);
}