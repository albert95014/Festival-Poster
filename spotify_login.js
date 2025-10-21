const handleLogin = async () => {
  
    const generateRandomString = (length) => {
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
  
    const codeVerifier  = generateRandomString(64);
  
    const sha256 = async (plain) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      return window.crypto.subtle.digest('SHA-256', data)
    }
  
    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }
  
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
  
    window.localStorage.setItem('code_verifier', codeVerifier);
    
    const params =  {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI_AFTER_LOGIN,
    }

    console.log('scopes: ' + SCOPES)
  
    SPOTIFY_AUTHORIZE_ENDPOINT.search = new URLSearchParams(params).toString();
    window.location.href = SPOTIFY_AUTHORIZE_ENDPOINT.toString();
  
    console.log('Generated code_verifier:', codeVerifier);
}

document.getElementById('signInButton').addEventListener('click', handleLogin);
