import { useData } from "./useData";
import AppSettings from "../apis/settings";

export function useSettings(asyncFunc, options) {
    const { entityId } = { entityId: "", ...options };

    const { data, error, loading, reload } = useData(
        async () => {
            const client = new AppSettings();
            return await asyncFunc(client);
        },
        { auto: false }
    );

    return { data, error, loading, reload };
}