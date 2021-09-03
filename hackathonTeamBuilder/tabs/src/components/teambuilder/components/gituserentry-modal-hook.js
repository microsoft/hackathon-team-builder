import React, { useState } from 'react';
import gitapi from '../apis/gitapi';
//import { useBooleanKnob } from '@fluentui/docs-components'
import { useBooleanKnob } from '@stardust-ui/docs-components' 
import nh4h from '../apis/nh4h';
import { Flex, Header,TeamCreateIcon, Dialog,Form, FormInput, FormCheckbox, FormButton, FormField, Input,Label,Menu,Dropdown,List, Image } from '@fluentui/react-northstar';
import { SearchIcon, ExclamationCircleIcon } from '@fluentui/react-icons-northstar'
//import { createCallbackLogFormatter } from '@fluentui/code-sandbox'

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

  const [open, setOpen] = useBooleanKnob({
    name: 'open',
  })

  var selectedIndex = -1;
  var selectedUser;
  
  //////////////////////////

  // Enable Let's Go button
  const letsgo = () => {
    let user = document.getElementById("selected-user").querySelectorAll('[aria-atomic="true"]')[0].innerText;
  
    //var letsgobutton = document.getElementById("letsgo");
    //letsgobutton.className = "ui positive button active";
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
        console.log(tempghuserlist);
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
   console.log(selectedUser);
    // Reading Github username from dropdown
    let username = selectedUser;
    let body = {
      UserId: props.userid,
      GitHubUser: username,
      GitHubId: githubid
    };
    props.saveGH(body);
     // Activity Id for adding GitHub user is 11
    props.activityPoints(11); 
    props.Callback();
    setOpen(false);
  };
 
  return (
    <div>
      <Dialog
           open
           closeOnOutsideClick={true}
    confirmButton="I'm Ready!"
    onConfirm={saveGitUserId}
    content={<Form
     
    
    >
      <FormField>
        <div> 
        
        <Input id="gituserid-input" fluid  placeholder="@..."  />
        <FormButton fluid primary content="Search" onClick={() => getGitHubUser()}/>
        <br /><br />
        </div>
              
                <Label  >
                  Don't have one? It's easy! Here's <a target="_blank" href="https://github.com/join">how</a> :)
                </Label> <br /><br />
                <Label >Select your username: </Label>
                {selectedIndex ?
                <List selectable id="selected-user"
                
                selectedIndex={selectedIndex}
                defaultSelectedIndex={0} 
                onSelectedIndexChange={(e, newProps) => {
                  
                  
                    selectedUser=ghuserlist[newProps.selectedIndex].text
                    selectedIndex= newProps.selectedIndex
                  
                }}
                items={
                  
                  ghuserlist.map( (user) => {
                    return {
                      media: (
                        <Image
                          src={user.image.src}
                          avatar
                        />
                      ),
                        header: user.key,
                    }
                })
                  
                  } />
                  : <div> </div>}

              </FormField>

              <FormField id="displayusers" style={{"display": "none"}}>
                
                <Label >Select your username: </Label>
                <List selectable defaultSelectedIndex={0} items={ghuserlist} />
                 
              </FormField>

    </Form>}
    header="Do you have a GitHub Account?"
 
  />
    </div>
  )
}
export default GitHubUserEntryHook