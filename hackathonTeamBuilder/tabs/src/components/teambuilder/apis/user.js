import nh4h from './nh4h';

class User {
  static APIURL = '/users/';
  static APICODEURL = '/reglink/code';
  static ROLE = "userRole";
  static REGEMAIL = "userRegEmail";
  static TEAMSEMAIL = "UserMSTeamsEmail";
  static DISPLAYNAME = "UserDisplayName";
  static TIMECOMMITMENT = "UserTimeCommitment";
  static ACTIVE = "Active";
  static SKILLS = "tblUserSkillMatch";
  static OPTOUT = "userOptOut";
  static SKILL = "UserSkill";
  static MSFTOPTIN = "MSFTOptIn";
  static JNJOPTIN = "JNJOptIn";
  static SONSIELOPTIN = "SONSIELOptIn";


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
  notfound;

  constructor() {
    this.userid = false;
    this.role = "Preregistrant";
    this.active = false;
    this.attemptedPreReg = false;
    this.optin = false;
  }

  /**
    * sets user id
    */
  getUserID = (authToken) => {
    let body = {};
    body[User.TEAMSEMAIL] = this.email;
    let apiClient = nh4h(authToken);    
    return apiClient.post(User.APIURL + 'msemail', body)
      .then((response) => {
        if (response.data.returnError) {          
          this.found = false;
        } else {
          this.found = true;
          this.userid = response.data.userId;
          this.mySkills = response.data[User.SKILLS];
          this.githubid = response.data.gitHubId;
          this.githubuser = response.data.gitHubUser;


          if (this.role === "Preregistrant") {
            this.role = response.data[User.ROLE];
          }//else role has been modified via an OTC and shouldn't be touched
          this.active = response.data['active'];
          this.displayname = response.data[User.DISPLAYNAME];
          this.optin = !response.data[User.OPTOUT];

        }
      });
  }
  /**
   * This is here for documentation purposes and won't be called b/c getting the userID auto-reregisters user
   */
  isPreregistered() {
    return this.userid ? true : false;
  }

  updateUser = (authToken) => {
    let apiClient = nh4h(authToken);
    return apiClient.put(User.APIURL + this.userid, this.getUserBody())

      .catch(err => {

        console.error(err);
      });
  }

  saveGitUserId = (authToken, userId, data) => {
    let apiClient = nh4h(authToken);
    
    return apiClient.put("/users/github/" + userId, data)
      .catch(err => console.error(err));      
  }

  checkCode = (authToken, otccode) => {
    let apiClient = nh4h(authToken);
    let body = {
      UsedByEmail: this.email,
      UniqueCode: otccode
    };
    return apiClient.post(User.APICODEURL, body)
      .then((response) => {
        if (!response.data.returnError) {
          this.role = response.data;
        }
      })
  }

  getUserBody = () => {
    let body = {};
    body[User.REGEMAIL] = this.email;
    body[User.TEAMSEMAIL] = this.email;
    body[User.ROLE] = this.role;
    body[User.DISPLAYNAME] = this.displayname;
    body[User.OPTOUT] = this.optin;
    body[User.ACTIVE] = this.active;
    body[User.JNJOPTIN] = this.jnjnewsletter
    body[User.SONSIELOPTIN] = this.sonsielnewsletter
    body[User.MSFTOPTIN] = this.msftnewsletter
    return (body);
  }

  getTeam = (authToken) => {
    let apiClient = nh4h(authToken);
    return apiClient.get(User.APIURL + 'solutions/' + this.userid)
      .then((resp) => {
        if (resp.data.teamId.length > 0) {
          this.myteam = resp.data.teamId[0];
          this.islead = resp.data.isLead;
        } else {
          this.islead = 0;
          this.myteam = null;
        }
      });
  }

  changeTeamMembership = (authToken, join, id, name, isFromCreate = 0, islead = 0) => {
    let teamMembers = [];
    let teamSlug = name.replace(/ +/g, "-");

    if (join) {
      let thisUser = { TeamId: id, UserId: this.userid, IsLead: islead };

      teamMembers.splice(0, 0, thisUser);
    } else {
      //teamMembers.splice(index, 1);
    }

    let apiClient = nh4h(authToken);
    let body = {
      UserId: this.userid,
      GitHubUser: this.githubuser,
      GitHubId: this.githubid,
      tblTeamHackers: teamMembers
    };

    return apiClient.put('/users/solutions/' + this.userid + '?teamName=' + teamSlug + '&isFromCreate=' + isFromCreate, body);
  }

}
export default User;