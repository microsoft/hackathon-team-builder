import { useState, useEffect } from "react";
import { useTeamsFx } from "../../sample/lib/useTeamsFx";
import AppSettings from "../apis/settings";

export function useSettings(options) {
    const { token } = { token: "", ...options };
    const { context } = useTeamsFx();
    const [settings, setSettings] = useState({});     

    useEffect(() => {
        let loadSettings = async () => {
            const client = new AppSettings(token);
            const results = await client.getAppSettingsForTeam(context.entityId);

            if (results) {
                let data = results.appSettingsByMSTeamId;
                let result = {
                    useTeams: data.find((i) => i.setting === "USE_TEAMS")?.value === 'true' ? true : false,
                    usePrivateChannels: data.find((i) => i.setting === "USE_PRIVATE_CHANNELS")?.value === 'true' ? true : false,
                    authEnabled: data.find((i) => i.setting === "ENABLE_AUTH")?.value === 'true' ? true : false,
                    maxTeamSize: data.find((i) => i.setting === "MAX_TEAM_SIZE")?.value ?? "0",
                    gitHubOrg: data.find((i) => i.setting === "GIT_HUB_ORG")?.value ?? "",
                    gitHubEnabled: data.find((i) => i.setting === "GIT_HUB_ENABLED")?.value === 'true' ? true : false
                };

                setSettings(result);
            }
        };

        if (context) {
            loadSettings();
        }
    }, [context]); // eslint-disable-line react-hooks/exhaustive-deps

    return settings;
}