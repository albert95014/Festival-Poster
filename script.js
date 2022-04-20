// https://accounts.spotify.com/authorize?
// client_id=5fe01282e94241328a84e7c5cc169164&
// redirect_uri=http:%2F%2Fexample.com%2Fcallback&
// scope=user-read-private%20user-read-email&response_type=token&state=123

const CLIENT_ID = "233100eb3af84085b5818cd4558b46c2"
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize"
const REDIRECT_URI_AFTER_LOGIN = "http://127.0.0.1:8887/"
const SPACE_DELIMITER = "%20"
const SCOPES = ["user-top-read"];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER)

const TOP_ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=30"


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
      // setData(response.data);
      // console.log(response.data.items.length);
      for (const artist of response.data.items) {
        artistNames.push(artist.name);
      }
      console.log(artistNames);

      start();
    })
    .catch((error) => {
      console.log(error);
    })
}

function handleLogin() {
  window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`

}
