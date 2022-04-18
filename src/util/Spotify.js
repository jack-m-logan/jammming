require('dotenv').config()

let accessToken;
const clientID = process.env.REACT_APP_CLIENT_ID;
const redirectURI = 'http://localhost:3000/';


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // Check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        // Check URL for access token & expiry
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            
            //Clear parameters to avoid grabbing expired token
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&show_dialog=true&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }
    },

    search(input) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${input}`, 
        { headers: {
            Authorization: `Bearer ${accessToken}`
        }})
        .then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;

        return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then(response => response.json())
        .then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, { 
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json())
            .then(jsonResponse => {
                const playlistID = jsonResponse.id;
                console.log(playlistID, trackURIs);
                
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}}/tracks`, { 
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackURIs })
                })
            })
        })
    }
}

export default Spotify;