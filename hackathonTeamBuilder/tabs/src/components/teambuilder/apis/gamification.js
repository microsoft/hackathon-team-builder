import axios from 'axios';

export const GameAPIScope = 'api://f5b001f0-53b7-421c-9f76-4301dfae1dd8/user_impersonation';

export default function(accessToken) {
    return axios.create({
        baseURL: 'https://nursehack-gamificationapi.azurewebsites.net/api',
        headers: {
            common:{
            'content-type':'application/json',
            },
            'Authorization': `Bearer ${accessToken}`
        }
    });
}
