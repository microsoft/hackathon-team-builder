
import React from 'react';
import {NavLink} from 'react-router-dom';

import nh4h from '../apis/nh4h';

class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamId: this.props.match.params.teamId,
      teamData: {}
    }
  }
  
  componentDidMount() {

    let request_url = "/solutions/" + this.state.teamId;

    nh4h.get(request_url)
    .then((response) =>
      this.setState({
        teamData: response.data
      })
    ).then(()=> {
      console.log(this.state.teamData);
    })
  }

  render() {
    
    let joinTeamUrl = "/join/" + this.state.teamId;
    let leaveTeamUrl = "/leave/" + this.state.teamId;

    return(
      <div className="ui segments">
        <div className="ui segment">
          Team ID: <br/> {this.state.teamData.teamId}
        </div>
        <div className="ui segment">
          Team Name: <br/> {this.state.teamData.teamName}
        </div>
        <div className="ui segment">
          Team Description: <br/> {this.state.teamData.teamDescription}
        </div>
        <div className="ui segment">
          Challenge Area: <br/> {this.state.teamData.challengeName}
        </div>
        <div className="ui segment">
          <NavLink to={joinTeamUrl}>
            <button className="ui positive button">Join</button>
          </NavLink>
          <NavLink to={leaveTeamUrl}>
            <button className="ui red button">Leave</button>
          </NavLink>
        </div>
      </div>
    )
  }
}

export default Team;