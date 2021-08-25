import axios from 'axios';

export default axios.create({
    baseURL: 'https://nursehack-gamificationapi.azurewebsites.net/api',
    headers: {
        common:{
        'content-type':'application/json',
        },
        'ClientTeamEmbed':'caWU JvVGqXaH n9m7by', 
    }
});


