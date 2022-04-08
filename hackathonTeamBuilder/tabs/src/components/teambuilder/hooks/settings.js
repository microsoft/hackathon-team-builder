import { useData } from "../../sample/lib/useData";
import { useTeamsFx } from "../../sample/lib/useTeamsFx";
import AppSettings from "../apis/settings";

export function useSettings(asyncFunc, options) {
    const { token } = { token: "", ...options };
    const { context } = useTeamsFx();

    const { data, error, loading, reload } = useData(async () => {
        const client = new AppSettings(token);
        return await asyncFunc(client, context.entityId);
    }, { dependsOn: [context] });

    return { data, error, loading, reload };
}