const CLIENT_ID = "233100eb3af84085b5818cd4558b46c2"
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize"
// const REDIRECT_URI_AFTER_LOGIN = "http://127.0.0.1:8887"
const REDIRECT_URI_AFTER_LOGIN = "https://albert95014.github.io/Festival-Poster"
const SPACE_DELIMITER = "%20"
const SCOPES = ["user-top-read"];
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
  if (window.location.hash) {
    const hash = window.location.hash;
    console.log(hash)

    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      console.log(currentValue);
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {})

    return paramsSplitUp;
  }
}

function getSpotifyData() {
  const spotifyData = getReturnedParamsFromSpotifyAuth();

  const accessToken = spotifyData.access_token;
  const tokenType = spotifyData.token_type;
  const expiresIn = spotifyData.expires_in;

  spotifyGetArtists(accessToken, tokenType, expiresIn);

  signInState = true;
  checkSignInState();
}

function spotifyGetArtists(accessToken, tokenType, expiresIn) {
  axios
    .get(TOP_ARTISTS_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(response => {
      artistNames = [];
      artistLinks = [];
      artistImages = [];
      // setData(response.data);
      // console.log(response.data.items.length);
      for (const artist of response.data.items) {
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
      

    })
    .catch((error) => {
      console.log(error);
    })
}

function handleLogin() {
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`

}

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