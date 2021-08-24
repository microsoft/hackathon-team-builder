import nh4h from './nh4h';

class User {
  static APIURL='/users/';  
  static APICODEURL='/reglink/code';  
  static ROLE="userRole";
  static REGEMAIL="userRegEmail";
  static TEAMSEMAIL="UserMSTeamsEmail";
  static DISPLAYNAME="UserDisplayName";
  static TIMECOMMITMENT="UserTimeCommitment";
  static ACTIVE="Active";
  static SKILLS="tblUserSkillMatch";
  static OPTOUT="userOptOut";
  static SKILL="UserSkill";
  static MSFTOPTIN="MSFTOptIn";
  static JNJOPTIN="JNJOptIn";
  static SONSIELOPTIN="SONSIELOptIn";
    
 
  userid;
  email;
  displayname;
  role;
  mySkills;
  attemptedPreReg;
  active;
  optin;
  jnjnewsletter;
  sonsielnewsletter;
  msftnewsletter;
  myteam;
  islead;
  githubid;
  githubuser;

  constructor(){
    this.userid=false;
    this.role="Preregistrant";
    this.active=false;
    this.attemptedPreReg=false;
    this.optin=false;
  }

  /**
    * sets user id, preregisters user if needed
    */
  getUserID = () => {
    let body = {};
    body[User.TEAMSEMAIL] = this.email ;
    return nh4h.post(User.APIURL+'msemail', body)
      .then((response) => {
        
        if(response.data.returnError){            
         /**
          * We don't want to register this user
          *   this.preRegister();     
          */
        }else{
          this.userid= response.data.userId;
          this.mySkills= response.data[User.SKILLS];
          this.githubid=response.data.gitHubId;
          this.githubuser=response.data.gitHubUser;
          

          if(this.role==="Preregistrant"){
           this.role=response.data[User.ROLE];
          }//else role has been modified via an OTC and shouldn't be touched
          this.active=response.data['active'];
          this.displayname=response.data[User.DISPLAYNAME];
          this.optin=!response.data[User.OPTOUT];
          
        }
      });
  }
  /**
   * This is here for documentation purposes and won't be called b/c getting the userID auto-reregisters user
   */
  isPreregistered(){
    return this.userid?true:false;
  }

  preRegister=()=>{
    //circuit breaker to prevent infinite loops
    if(this.attemptedPreReg) {return;}
      nh4h.post(User.APIURL, this.getUserBody())
      .then((response)=>{
        if(response.data.returnError){
          this.attemptedPreReg=true;
        }else{
          this.getUserID();
        }
      })
      .catch(err => {
        this.attemptedPreReg=true;
        console.error(err);
      });
      ;
  }

  updateUser=()=>{
    
        return    nh4h.put(User.APIURL+this.userid, this.getUserBody())
            
            .catch(err => {
              
              console.error(err);
            });
  }

  checkCode=(otccode)=>{
     let body={
        UsedByEmail:this.email,
        UniqueCode:otccode
     };
    return nh4h.post(User.APICODEURL,body)
      .then((response)=>{
        if(!response.data.returnError){
            this.role=response.data;
        }
      })
  }

  getUserBody=()=>{
      let body={};
      body[User.REGEMAIL]=this.email;
      body[User.TEAMSEMAIL]=this.email;
      body[User.ROLE]=this.role;
      body[User.DISPLAYNAME]=this.displayname;
      body[User.OPTOUT]=this.optin;
      body[User.ACTIVE]=this.active;    
      body[User.JNJOPTIN]=this.jnjnewsletter
      body[User.SONSIELOPTIN]=this.sonsielnewsletter
      body[User.MSFTOPTIN]=this.msftnewsletter
      return(body);
  }
   
  getTeam=()=>{
   return nh4h.get(User.APIURL +'solutions/'+this.userid)
    .then((resp)=>{
      if(resp.data.teamId.length>0) {
        this.myteam=resp.data.teamId[0];
        this.islead=resp.data.isLead;
      }else{
        this.islead=0;
        this.myteam=null;
      }          
    });
  }

  changeTeamMembership=(join, id,islead=0) =>{
    let teamMembers = [];
    if (join) {
      let thisUser = { TeamId: id, UserId: this.userid, IsLead: islead };
      teamMembers.splice(0, 0, thisUser);
    }else{
      //teamMembers.splice(index, 1);
    }
    
    let body = {
      UserId: this.userid,
      tblTeamHackers:teamMembers
    };
        
   return nh4h.put('/users/solutions/' + this.userid, body);
  }

}
export default User;