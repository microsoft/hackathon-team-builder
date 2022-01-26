## Team Builder

| [Documentation](https://github.com/microsoft/hackathon-team-builder/wiki/Documentation) | [Deployment guide](https://github.com/microsoft/hackathon-team-builder/wiki/Deployment-Guide) | [Architecture]() |
| ---- | ---- | ---- |

## Description

Create and manage Hackathon Teams with this sample Microsoft Teams Tab application used to 
The app deploys all assets needed for users to:
    * Create a hackathon team
    * Edit a hackathon team's description
    * Join a hackathon team
    * Leave a hackathon team
    * Lead a hackathon team

You can use this app as sample code, or run a simple hackathon with it.

To run this locally, or deploy to your Team's workspace you need:
* [Visual Studio Code](https://code.visualstudio.com/Download)
* [Team's Toolkit Extension](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)

[Desploying Locally](#deploying-locally)
[Deploying To Teams](#deploying-to-teams)

## Deploying Locally
1 Clone the project and open Visual Studio Code at the hackathonTeamBuilder subdirectory
```
git clone https://github.com/microsoft/hackathon-team-builder.git
cd hackathon-team-builder
cd hackathonTeamBuilder
code .
```
2 Open the Team's Toolkit Extension
3 Sign in to your M365 organization ([Create an M365 org](https://www.microsoft.com/en-us/windows-365?rtc=1))
4 Sign in to your Azure subscription ([Create an Azure subscription](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription#:~:text=Create%20a%20subscription%20in%20the%20Azure%20portal.%201,that%20helps%20you%20easily%20...%20%20See%20More.))
5 Once signed in hit F5 to run locally (this may take several minutes)
6 A new broswer will open to a local instance of Teams (you might be asked to login again)
7 You will see a screen asking if you want to Add TeamBuilder to Teams - click add
You're now in TeamBuilder!

## Deploying to Teams
1 Follow steps 1-4 from the Deploying Locally section above
2 Click on the Team's Toolkit > Deployment > Provision in the cloud
3 Click on the Team's Toolkit > Deployment > Deploy to the cloud 
4 Click on the Team's Toolkit > Deployment > Publish To Teams
5 In your Team's control panel you will need to update the version of the Team Builder A]
6 Add Team Builder to any Team Channel just as you would any a]

## Products
- Micorosoft Teams Tab App
- React Application

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
