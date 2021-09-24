import axios from 'axios';
import {config} from '../../config';

export const HackAPIScope = config.HACKAPI_SCOPE;

export default function(authToken) { 
 return axios.create({

  baseURL: config.HACKAPI_ENDPOINT,
    headers: {
      common:{
        'content-type':'application/json',
      },
      'Authorization': `Bearer ${authToken}`,
    }
  });
}