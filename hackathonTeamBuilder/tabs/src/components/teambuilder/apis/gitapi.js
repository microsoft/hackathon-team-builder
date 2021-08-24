import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.github.com/search',
    headers: {
      common:{
        'content-type':'application/vnd.github.v3+json',
      }
    }
  });
