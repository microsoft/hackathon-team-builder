import nh4h from './nh4h';
import { gql } from '@apollo/client';
import graphapi from './graphapi';

function Challenge() {
  const CHALLENGEQUERY = gql `
  query{
    challenges:getChallenges{id track name description}
  }
  `;

  async function getAllChallenges(authToken) {
    let client = graphapi(authToken);
    let response = await client.query({ query: CHALLENGEQUERY });
    if (response.data) {
      return response.data.challenges;
    }
  }

  return {
    getAllChallenges: getAllChallenges
  }
}

export default Challenge;