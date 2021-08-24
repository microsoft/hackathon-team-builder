import axios from 'axios';

export default axios.create({
    baseURL: 'https://hackapi-v2.azurewebsites.net/api',
    //baseURL: 'https://localhost:44300/api',
    headers: {
      common:{
        'content-type':'application/json',
      },
      'ClientTeamEmbed':'caWU JvVGqXaH n9m7by',
    }
  });
