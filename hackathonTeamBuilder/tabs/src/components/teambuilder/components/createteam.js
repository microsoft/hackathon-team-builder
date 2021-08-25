import React from 'react';
import { Dropdown, Label } from 'semantic-ui-react';

class TeamForm extends React.Component {
  constructor(props) {
    super(props);
    let name = '';
    let desc = '';
    let skills = '';
    let chall = '';  //Education, Communication
    let channel = ''; //team channel

    if (props.team) {
      let t = props.team;

      name = t.teamName;
      desc = t.teamDescription;
      skills = t.skillsWanted;
      chall = t.challengeName;
      channel = t.msTeamsChannel;
    }

    const channelItems = [];
    //channelItems.push({key:'', text:'', value:''});
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 1.' + ('0' + i).slice(-2), text: 'Team 1.' + ('0' + i).slice(-2), value: 'Team 1.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 2.' + ('0' + i).slice(-2), text: 'Team 2.' + ('0' + i).slice(-2), value: 'Team 2.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 3.' + ('0' + i).slice(-2), text: 'Team 3.' + ('0' + i).slice(-2), value: 'Team 3.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 4.' + ('0' + i).slice(-2), text: 'Team 4.' + ('0' + i).slice(-2), value: 'Team 4.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 5.' + ('0' + i).slice(-2), text: 'Team 5.' + ('0' + i).slice(-2), value: 'Team 5.' + ('0' + i).slice(-2) }); }

    this.state = {
      teamName: name,
      teamDescription: desc,
      challengeName: chall,
      challengeNameOptions: [
        { key: 'Education', text: 'Track 1 - Vaccine Education & Delivery', value: 'Track 1 - Vaccine Education & Delivery' },
        { key: 'MedicalDeserts', text: 'Track 2 - Medical Deserts', value: 'Track 2 - Medical Deserts' },
        { key: 'Equity', text: 'Track 3 - Health Equity & Racial Disparities', value: 'Track 3 - Health Equity & Racial Disparities' },
        { key: 'Care', text: 'Track 4 - New Models and Settings for Care', value: 'Track 4 - New Models and Settings for Care' },
        { key: 'Open', text: 'Track 5 - Open Topic', value: 'Track 5 - Open Topic' }
      ],
      skillsWanted: skills,
      teamActive: 1,
      submitting: false,
      created: false,
      msTeamsChannel: channel,
      channelOptions: channelItems,
    };
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.team !== this.props.team) {
      if (this.props.team) {
        let t = this.props.team;
        let name = t.teamName;
        let desc = t.teamDescription;
        let chall = t.challengeName;
        let channel = t.msTeamsChannel;
        this.setState({
          teamName: name,
          teamDescription: desc,
          challengeName: chall,
          msTeamsChannel: channel
        });
      }
    }

  }
  
  handleInputChange = (event, d) => {
    // Hide warning label for duplicate names
    if(document.getElementById("name-validation")) {
      document.getElementById("name-validation").style["display"] = "none";
    }
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;
    if (d) {
      name = d.name;
      value = d.value;
    }
    this.setState({
      [name]: value
    });

  }

  handleInputChangeTrack = (event, d) => {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;
    if (d) {
      name = d.name;
      value = d.value;
    }
    this.setState({
      [name]: value
    });

    this.updateDropDown(value.match(/(\d+)/)[0])
  }


  updateDropDown = (n) => {
    this.state.channelOptions = []
    for (let i = 1; i < 21; i++) { this.state.channelOptions.push({ key: 'Team ' + n + '.' + ('0' + i).slice(-2), text: 'Team ' + n + '.' + ('0' + i).slice(-2), value: 'Team ' + n + '.' + ('0' + i).slice(-2) }); }
  }

  newTeam = () => {
    let body = {
      teamName: this.state.teamName,
      teamDescription: this.state.teamDescription,
      challengeName: this.state.challengeName,
      skillsWanted: this.state.skillsWanted,
      msTeamsChannel: this.state.msTeamsChannel
    }
    this.props.createTeam(body);
  }

  editTeam = () => {
    let body = {
      teamName: this.props.team.teamName,
      teamDescription: this.state.teamDescription,
      challengeName: this.state.challengeName,
      skillsWanted: this.state.skillsWanted,
      msTeamsChannel: this.state.msTeamsChannel
    };
    this.props.editTeam(body);
  }


  handleSubmit = (event) => {
    event.preventDefault();
    if(!this.teamNameExists(event)) {
      this.setState({ submitting: true }, () => {
        if (!this.props.team) {
          // Activity Id for creating team is 12
          this.props.activityPoints(12)
          this.newTeam();
        } else {
          this.editTeam();
        }
      });
    } else { 
      // alert ("Team name '" + this.state.teamName + "' already exists")
      var warning = document.getElementById("name-validation");
      warning.style["display"] = "";
      return false;
    }
  

  }

  teamNameExists = (event) => {
    event.preventDefault();
    if(document.getElementById("teamName")) {
      let newTeam = document.getElementById("teamName").value.toLowerCase();
      
      for (let existingTeam of this.props.teamNames) {
        if (existingTeam.toLowerCase() == newTeam) {
          this.setState({nameExists: true});
          return true;
        }
      }

      // Don't allow special characters
      var isValid = newTeam.match(/^[a-zA-Z0-9\s]+$/g);
      if (!isValid) return true
      
      return false;
      

    }
    
    return false;
  }

  render() {

    //Check if all fields have been populated
    let valid = (
      this.state.challengeName !== ''
      && this.state.msTeamsChannel !== ''
      && this.state.teamName.trim() !== ''
      && this.state.teamDescription.trim() !== ''
    );


    return (
      <div hidden={!this.props.visible} className="ui segment">
        {!this.state.created ?
          <form onSubmit={this.handleSubmit} className="ui form">
            {!this.props.team ? "" :
              <div className="field">
                <h2>{this.state.teamName}</h2>
              </div>
            }
            {this.props.team ? "" :
              <div className="field">
                <label>Challenge Area</label>
                <Dropdown name="challengeName" placeholder='Select a challenge' fluid selection options={this.state.challengeNameOptions} onChange={this.handleInputChangeTrack} defaultValue={this.state.challengeName} />
              </div>
            }

            <div className="field">
              <label>Assigned Team Channel</label>
              <Dropdown name="msTeamsChannel" fluid selection options={this.state.channelOptions} onChange={this.handleInputChange} placeholder={this.state.msTeamsChannel} />

            </div>

            {this.props.team ? "" :
              <div className="field">
                <label>Team Name</label>
                <input id="teamName" value={this.state.teamName} name="teamName" type="text" onChange={this.handleInputChange} />
              </div>
            }

            <div className="field">
              <label>Team description</label>
              <textarea value={this.state.teamDescription} name="teamDescription" rows="2" onChange={this.handleInputChange}></textarea>
            </div>
            {/* <div className="field">
              <label>We are looking for people with these skills (comma seperated (ex: C#, HIPPA, EPIC)</label>
              <input value={this.state.skillsWanted} name="skillsWanted" type="text" onChange={this.handleInputChange} />
            </div> */}
            {this.props.team ? "" :
              <div className="field">

              </div>
            }
            <div className="ui basic segment">
              {this.state.submitting ?
                <span className="ui">Creating...</span>
                :
                (valid ?
                  <div>
                    <button className="ui primary button" type="submit">{this.props.team ? 'Save' : 'Create Team'}</button>
                    <Label as='a' size='large' style={{"padding": "12px 15px"}} onClick={this.props.cancel}>Cancel</Label>
                  <Label id="name-validation" style={{"display": "none"}} color="grey">  '{this.state.teamName}' exists or the name is invalid (only alpha numeric is allowed.)</Label> </div>
                  : <span className="ui message message-warning">All of the above are required</span>)
                    }
                  </div>
          </form>
          :
          <span className="ui">Team Created</span>
        }
      </div>
    )
  }
}

export default TeamForm;