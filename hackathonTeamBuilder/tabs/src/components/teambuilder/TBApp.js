import React, { Component } from 'react';

import TeamsList from './components/teamslist';
import gamification from './apis/gamification';
import TeamForm from './components/createteam';
import TeamListItem from './components/teamlistitem';
import GitHubUserEntry from './components/gituserentry-modal-hook';
import { Message } from 'semantic-ui-react'
import User from './apis/user';
import Team from './apis/team';
import {loadConfiguration , TeamsUserCredential} from "@microsoft/teamsfx";

class TBApp extends Component {
  constructor(props) {
    super(props);
    let msalConfig = {
      auth: {
        clientId: 'b3544b0c-1209-4fe8-b799-8f63a0179fa0',
        authority: "https://login.microsoftonline.com/e773e193-89d3-44d9-ae4e-17766699f674",
        //    redirectUri:"/loggedin" 
      }
    };
    
    this.state = {
    
      user: new User(),
      team: new Team(),
      username: "",
      email: "",
      enableTeamBuilder: false,
      loggedin: false,
      t: null,
      myteam: -1,
      showcreate: false,
      skillsWantedOptions: [],
      apiScope: "api://05fc1a93-6c0e-4af6-9424-368474961462/user_impersonation"
    };
  }

  activityPoints = (activityId) => {
    // gamification.API.addPoint(this.props.userEmail, activityId);
    let body = {
      UserEmail: this.state.email,
      ActivityId: activityId
    }
    // += TODO: Get activity name and show it to user! 
    gamification.post("/useractivity/Points", body)
      .then((response) => {
      });
  }

  componentDidMount() {
    loadConfiguration({
      authentication: {
        initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
        simpleAuthEndpoint: process.env.REACT_APP_TEAMSFX_ENDPOINT,
        clientId: process.env.REACT_APP_CLIENT_ID,
      
      },
    });
    const credential = new TeamsUserCredential();
    credential.getUserInfo()
      .then((res)=>{
        let nUser = this.state.user;
        nUser.email = res.preferredUserName;
        this.setState(
          {loggedin:true,user:nUser,email:res.preferredUserName,username:res.displayName})
        credential.getToken(this.state.apiScope)
          .then((res)=>{
            this.setState({token:res.token});
            this.setState({
              team: new Team(res.token)
          }, () => {
            this.getUserInfo();
          });
          });
      });
    
    
      
     
      
  }

  getAccessToken = async () => {
    let req = {
      scopes: [this.state.apiScope]
    }

    let resp = await this.state.msalInstance.acquireTokenSilent(req);
    return resp.accessToken;
  }

  getUserInfo = async () => {
    let authToken = this.state.token;

    this.state.user.getUserID(authToken)
      .then(() => {
        this.setState({ user: this.state.user });
        if (this.state.user.githubuser) {
          this.state.user.getTeam(authToken)
            .then(() => {
              this.setState({
                user: this.state.user,
                enableTeamBuilder: true
              }, () => { this.getTeams() });
            });
        } else {
          this.setState({ enableTeamBuilder: false });
        }
      });
  }

  getTeams = () => {
    this.state.team.getAllTeams()
      .then(() => {
        this.setState({ team: this.state.team, user: this.state.user }, () => {
          this.setMyTeam();
        });

      });

  }

  CreateNewTeam = async (body) => {
    let authToken = await this.getAccessToken();
    body.createdBy = this.state.user.email;
    this.state.team.createNewTeam(authToken, body)
      .then(() => {
        this.changeTeamMembership(true, this.state.team.teamid, body.teamName, 1, 1);
        this.toggleShowCreate();
        this.getTeams();
      });
  }

  editTeam = async (body) => {
    let authToken = await this.getAccessToken();
    body.modifiedBy = this.state.user.email;
    this.state.team.editTeam(authToken, this.state.user.myteam, body)
      .then(() => {
        window.location.reload(false); // refreshes page to put the form in clean state
        this.toggleShowCreate();
        this.getTeams();
      });
  }

  updateView = () => { }

  changeTeamMembership = async (join, id, name, isFromCreate = 0, islead = 0) => {
    if (join) {
      // Activity Id for joining a team is 13
      this.activityPoints(13);
    }

    let authToken = await this.getAccessToken();

    this.state.user.changeTeamMembership(authToken, join, id, name, isFromCreate, islead)
      .then(() => {
        this.getUserInfo();
        window.location.reload(false);
      });

  }

  toggleShowCreate = () => {
    this.setState({
      showCreate: !this.state.showCreate
    });
  }

  saveGitUser = async (body) => {
    let authToken = await this.getAccessToken();

    body.UserId = this.state.user.userid;
    this.state.user.saveGitUserId(authToken, this.state.user.userid, body)
      .then(() => {
        this.setState({ enableTeamBuilder: true });
      });
  }

  setMyTeam = () => {
    let t = this.state.team.allteams.find(obj => obj.id === this.state.user.myteam);
    this.setState({ t: t });
  }
  render() {
    let existingTeamNames = [];
    for (let team of this.state.team.allteams) {
      existingTeamNames.push(team.teamName);
    }

    let buttonText = !this.state.showCreate ? 'Create a Team!' : 'Never Mind';

    if (!this.state.user.found) {
      return (
        // <div class="ui active centered inline loader"></div> 
        <Message header='Contact Support!' content='User is not found or TeamBuilder API is down. Please ask for help in general channel.' />
      );
    } else if (this.state.enableTeamBuilder) {
      return (
        <div className="ui">
          <div id="TeamBuilder">
            {this.state.user.myteam ?
              <div hidden={this.state.showCreate}>
                <h2>Your Team </h2>
                <div className="ui special fluid">
                  <TeamListItem Callback={this.changeTeamMembership} edit={this.toggleShowCreate}
                    islead={this.state.user.islead} team={this.state.t} isTeamMember={true} />

                </div>
              </div>
              :
              <button onClick={this.toggleShowCreate} className="ui positive button">{buttonText}</button>
            }
            <TeamForm visible={this.state.showCreate} activityPoints={this.activityPoints} teamNames={existingTeamNames} team={this.state.t} createTeam={this.CreateNewTeam} editTeam={this.editTeam} cancel={this.toggleShowCreate} />
            <br /><h2>All Teams</h2>
            <TeamsList edit={this.toggleShowCreate} membership={this.changeTeamMembership} Callback={this.changeTeamMembership} myteam={this.state.user.myteam} teams={this.state.team.allteams} islead={this.state.user.islead} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="ui">
          {this.state.user.githubuser ?
            <div class="ui active centered inline loader"></div> :
            <GitHubUserEntry saveGH={this.saveGitUser} userid={this.state.user.userid} activityPoints={this.activityPoints} Callback={this.getTeams} />
          }
        </div>
      );
    }
  }
}

export default TBApp;