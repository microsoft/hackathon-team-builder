import React from "react";
import TBApp from "./teambuilder/TBApp";
import {
 List
} from '@fluentui/react-northstar';

import { Welcome } from "./sample/Welcome";

class Tab extends React.Component {
  groupBy(array, property) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
        if (!hash[array[i][property]]) hash[array[i][property]] = [];
        hash[array[i][property]].push(array[i]);
    }
    return hash;
}
render() {
  let teams=[
    {
      "mame": "Welcome to Nursehack Spring 2021",
      "id": 206,
      "teamDescription": "Welcome to our hackathon! \n\nThis is a demo team. Have fun!!",
      "githubURL": null,
      "skillsWanted": "",
      "modifiedBy": null,
      "createdBy": "dakim@microsoft.com",
      "challengeName": "Track 1 - Vaccine Education & Delivery",
      "msTeamsChannel": "Team 1.20",
      "Users": {
        "hackers": [
          {
            "islead": 1,
            "name": "Sean Hamill (MS)",
            "__typename": "UserExpanded"
          },
          {
            "islead": 1,
            "name": "JeffDevUp",
            "__typename": "UserExpanded"
          }
        ],
        "__typename": "User"
      },
      "__typename": "Team"
    },
    {
      "name": "Mentah",
      "id": 207,
      "teamDescription": "Access to and ability to receive mental healthcare, while helping patients to avoid stigma or judgments which might be associated with receiving said care and providing care where the patients are. One of the primary objectives is also to avoid undue burden or extra stress healthcare professionals.",
      "githubURL": null,
      "skillsWanted": "",
      "modifiedBy": null,
      "createdBy": "trgreer@microsoft.com",
      "challengeName": "Track 4 - New Models and Settings for Care",
      "msTeamsChannel": "Team 4.02",
      "Users": {
        "hackers": [
          {
            "islead": 0,
            "name": "Cecilia.KE",
            "__typename": "UserExpanded"
          },
          {
            "islead": 0,
            "name": "Kerrie",
            "__typename": "UserExpanded"
          },
          {
            "islead": 0,
            "name": "Kristi ",
            "__typename": "UserExpanded"
          },
          {
            "islead": 1,
            "name": "Alejandra Rico",
            "__typename": "UserExpanded"
          },
          {
            "islead": 1,
            "name": "Trevor",
            "__typename": "UserExpanded"
          },
          {
            "islead": 0,
            "name": "Linda Anders",
            "__typename": "UserExpanded"
          },
          {
            "islead": 0,
            "name": "Ben Zheng",
            "__typename": "UserExpanded"
          }
        ],
        "__typename": "User"
      },
      "__typename": "Team"
    },
    {
      "name": "New Futures",
      "id": 210,
      "teamDescription": "Creating a user-friendly and centralized COVID-19 vaccine appointment booking system for the Canadian province of Ontario",
      "githubURL": null,
      "skillsWanted": "",
      "modifiedBy": null,
      "createdBy": "joeylee18_@hotmail.com",
      "challengeName": "Track 1 - Vaccine Education & Delivery",
      "msTeamsChannel": "Team 1.05",
      "Users": {
        "hackers": [
          {
            "islead": 1,
            "name": "Joey Lee",
            "__typename": "UserExpanded"
          },
          {
            "islead": 0,
            "name": "Zayn",
            "__typename": "UserExpanded"
          },
          {
            "islead": 0,
            "name": "Joanna G",
            "__typename": "UserExpanded"
          },
          {
            "islead": 0,
            "name": "Dimuth Kurukula",
            "__typename": "UserExpanded"
          }
        ],
        "__typename": "User"
      },
      "__typename": "Team"
    }
  ];
  let cmeta=this.groupBy(teams,'challengeName');
  let categories= Object.getOwnPropertyNames(cmeta);
  
  return <div>
    There are {teams.length} teams.
    <List items={teams}/>   
    <hr/>
    
    There are {categories.length} categories
    <hr/>
    <TBApp/>
    <Welcome showFunction={ false } />
  </div>;
}
}
export default Tab;