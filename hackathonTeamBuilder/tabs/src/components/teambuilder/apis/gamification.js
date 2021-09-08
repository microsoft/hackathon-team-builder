import axios from 'axios';

export const GameAPIScope = 'api://05acec15-d6fb-4dae-a9b3-5886a7709df9/user_impersonation';

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
