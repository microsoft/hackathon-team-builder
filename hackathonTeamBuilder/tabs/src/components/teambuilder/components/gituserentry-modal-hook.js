import React, { useState } from 'react';
import gitapi from '../apis/gitapi';
import { Button, Modal, Input, Dropdown, Menu, Label, Form, Divider } from 'semantic-ui-react';
import nh4h from '../apis/nh4h';

const GitHubUserEntryHook = (props) => {
  const placeholdertxt = "Select your user id";
  // Github Userlist for the dropdown
  const [ghuserlist, setUserList] = useState([]);
  // Github Id to send to API
  const [githubid, setId] = useState("");
  // Loading status for the button
  const [isSaving, setSavingStatus] = useState(false);
  
  // Modal Dialog Options
  /////////////////////////////
  const modalReducer = (state, action) => {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { open: true, dimmer: action.dimmer, size: action.size }
      case 'CLOSE_MODAL':
        return { open: false }
      default:
        throw new Error()
    }
  };

  const [state, dispatch] = React.useReducer(modalReducer, 
    {
      open: true,
      dimmer: 'blurring',
      size: 'tiny',
      type:"OPEN_MODAL"
    }
  );
  const {dimmer, open, size} = state;

  //////////////////////////

  // Enable Let's Go button
  const letsgo = () => {
    let user = document.getElementById("selected-user").querySelectorAll('[aria-atomic="true"]')[0].innerText;
  
    var letsgobutton = document.getElementById("letsgo");
    letsgobutton.className = "ui positive button active";
  };

  // Retrieve Github user
  const getGitHubUser = () => {    
    let ghuser = document.getElementById("gituserid-input").value;
    var tempghuserlist = [];
    
    gitapi.get("/users?q=" + ghuser + "&per_page=100").then((resp) => {
      resp.data.items.map(i => {
        setId(i.id); 
        tempghuserlist.push({ key: i.login , text: i.login , value: i.login, image: { avatar: true, src: i.avatar_url }});
        setUserList(tempghuserlist);
        
        // Display the populated Github user dropdown
        document.getElementById("displayusers").style["display"] = "";
      })       
      
    }).catch (err => {
      console.log("err:", err);
    })
  }
  
  const saveGitUserId = () => {
    // Loading status
    setSavingStatus(true);
   
    // Reading Github username from dropdown
    let username = document.getElementById("selected-user").querySelectorAll('[aria-atomic="true"]')[0].innerText;
    let body = {
      UserId: props.userid,
      GitHubUser: username,
      GitHubId: githubid
    };
    props.saveGH(body);
     // Activity Id for adding GitHub user is 11
    props.activityPoints(11); 
    props.Callback();
  };

  return (
    <div>
      <Modal
        dimmer={dimmer}
        open={open}
        size={size}
      >
        <Modal.Header>Do you have a GitHub Account?</Modal.Header>
        <Modal.Content>
          <div className="ui ">
            <Form>
              <Form.Field>
                <Input id="gituserid-input" label='@' placeholder='Search username' action={{ onClick: () => getGitHubUser(), icon:"search" }} />
                <Label pointing>
                  Don't have one? It's easy! Here's <a target="_blank" href="https://github.com/join">how</a> :)
                </Label> <br /><br />
                
              </Form.Field>
              <Form.Field id="displayusers" style={{"display": "none"}}>
                <Divider />
                <Label color='teal' pointing="right">Select your username: </Label>
                <Menu compact>
                  <Dropdown id="selected-user" placeholder={placeholdertxt} onChange={letsgo} closeOnChange selection options={ghuserlist} item />
                </Menu>      
              </Form.Field>
            </Form>
          </div>   
          
        </Modal.Content>
        <Modal.Actions>
           <Label id="error" style={{"display": "none"}} prompt pointing="right">
              Uh oh. Reselect your id and please try again.
          </Label> 
          <Button id="letsgo" className="disabled inactive" positive onClick={() => { saveGitUserId(); }} loading={isSaving}>
            I'm ready!
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}
export default GitHubUserEntryHook