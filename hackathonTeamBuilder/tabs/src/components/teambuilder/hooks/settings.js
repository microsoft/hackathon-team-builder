import { useState, useEffect } from "react";
import { useTeamsFx } from "../../sample/lib/useTeamsFx";
import AppSettings from "../apis/settings";

export function useSettings() {
    const { context } = useTeamsFx();
    const [settings, setSettings] = useState(null);
    const client = AppSettings();

    useEffect(() => {
        let loadSettings = async () => {            
            await client.getAppSettingsForTeam.request(context.entityId);
        };

        if (context && context.entityId) {
            loadSettings();
        }
    }, [context]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (client.getAppSettingsForTeam.data) {
            let data = client.getAppSettingsForTeam.data.appSettingsByMSTeamId;
            let result = {
                useTeams: data.find((i) => i.setting === "USE_TEAMS")?.value === 'true' ? true : false,
                usePrivateChannels: data.find((i) => i.setting === "USE_PRIVATE_CHANNELS")?.value === 'true' ? true : false,
                authEnabled: data.find((i) => i.setting === "ENABLE_AUTH")?.value === 'true' ? true : false,
                maxTeamSize: parseInt(data.find((i) => i.setting === "MAX_TEAM_SIZE")?.value) ?? 0,
                gitHubOrg: data.find((i) => i.setting === "GIT_HUB_ORG")?.value ?? "",
                gitHubEnabled: data.find((i) => i.setting === "GIT_HUB_ENABLED")?.value === 'true' ? true : false
            };

            setSettings(result);
        }
    }, [client.getAppSettingsForTeam.data]);

    return settings;
}