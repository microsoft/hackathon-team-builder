import { useGraphQl } from "../hooks/useGraphQl";
import { loader } from "graphql.macro";

function AppSettings() {
  const SETTINGSQUERY = loader("../graphql/settingsquery.graphql");
  const ADDSETTING = loader("../graphql/addsetting.graphql");
  const ADDSETTINGS = loader("../graphql/addsettings.graphql");

  const getAppSettingsForTeamReq = useGraphQl(
    async (client, entityId) =>
      await client.query({ query: SETTINGSQUERY, variables: { entityId } })
  );
  const setAppSettingReq = useGraphQl(
    async (client, input) =>
      await client.mutate({ mutation: ADDSETTING, variables: { input } })
  );
  const addAppSettingsReq = useGraphQl(
    async (client, input) =>
      await client.mutate({ mutation: ADDSETTINGS, variables: { input } })
  );

  return {
    getAppSettingsForTeam: getAppSettingsForTeamReq,
    setAppSetting: setAppSettingReq,
    addAppSettings: addAppSettingsReq,
  };
}

export default AppSettings;
