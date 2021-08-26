import axios from 'axios';

export const HackAPIScope = 'api://05fc1a93-6c0e-4af6-9424-368474961462/user_impersonation';

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