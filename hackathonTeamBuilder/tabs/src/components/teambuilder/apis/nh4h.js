import axios from 'axios';

export const HackAPIScope = 'api://05acec15-d6fb-4dae-a9b3-5886a7709df9/user_impersonation';


export default function(authToken) { 
 return axios.create({
    baseURL: 'https://hackapi-tax6y5voqibmw.azurewebsites.net/api',
    //baseURL: 'https://localhost:44300/api',
    headers: {
      common:{
        'content-type':'application/json',
      },
      'Authorization': `Bearer ${authToken}`,
    }
  });
}