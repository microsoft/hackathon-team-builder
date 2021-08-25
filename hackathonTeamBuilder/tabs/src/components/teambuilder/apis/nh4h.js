import axios from 'axios';

export default function(authToken) { 
 return axios.create({
    baseURL: 'https://hackapi-v2.azurewebsites.net/api',
    //baseURL: 'https://localhost:44300/api',
    headers: {
      common:{
        'content-type':'application/json',
      },
      'Authorization': `Bearer ${authToken}`,
    }
  });
}