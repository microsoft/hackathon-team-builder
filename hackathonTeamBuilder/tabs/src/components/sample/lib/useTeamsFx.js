import { loadConfiguration, ResourceType, LogLevel, setLogLevel, setLogFunction } from "@microsoft/teamsfx";
import { useData } from "./useData";
import { useTeams } from "msteams-react-base-component";

var teamsfxEndpoint = process.env.REACT_APP_TEAMSFX_ENDPOINT;
var startLoginPageUrl = process.env.REACT_APP_START_LOGIN_PAGE_URL;
var functionEndpoint = process.env.REACT_APP_FUNC_ENDPOINT;
var clientId = process.env.REACT_APP_CLIENT_ID;

// TODO fix this when the SDK stops hiding global state!
let initialized = false;

export function useTeamsFx() {
  const [result] = useTeams({});
  const { error, loading } = useData(async () => {
    if (!initialized) {
      if (process.env.NODE_ENV === "development") {
        setLogLevel(LogLevel.Verbose);
        setLogFunction((level, message) => { console.log(message); });
      }
      loadConfiguration({
        authentication: {
          initiateLoginEndpoint: startLoginPageUrl,
          simpleAuthEndpoint: teamsfxEndpoint,
          clientId: clientId,
        },
        resources: [
          {
            type: ResourceType.API,
            name: "default",
            properties: {
              endpoint: functionEndpoint,
            },
          },
        ],
      });
      initialized = true;
    }
  });
  const isInTeams = true;

  // const theme = {
  //   siteVariables: {
  //     colors: {
  //       brand: {
  //         50: 'white',
  //         100: 'white',
  //         200: 'white',
  //         300: 'pink',
  //         400: 'lightpink',
  //         500: 'hotpink',
  //         600: 'deeppink',
  //         700: 'palevioletred',
  //         800: 'black',
  //         900: 'black',
  //       },
  //       grey: {
  //         50: '#F2F2F2',
  //         100: '#E6E6E6',
  //         200: '#CCCCCC',
  //         300: '#B3B3B3',
  //         400: '#999999',
  //         500: '#737373',
  //         600: '#666666',
  //         700: '#4D4D4D',
  //         800: '#333333',
  //         900: '#1A1A1A',
  //       },
  //       white: '#FFF',
  //     },
  //   }
  // };
  return { error, loading, isInTeams, ...result };
}
