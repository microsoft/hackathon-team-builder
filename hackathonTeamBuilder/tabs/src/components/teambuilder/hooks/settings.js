import { useData } from "../../sample/lib/useData";
import { useQuery } from "./query";
import AppSettings from "../apis/settings";

export function useSettings(asyncFunc, options) {
    const query = useQuery();
    const { entityId, token } = { entityId: "", token: "", ...options };
    // const initial = useData(async () => {
    //     const client = new AppSettings(token);
    //     return await asyncFunc(client, entityId);
    // });

    const { data, error, loading, reload } = useData(async () => {
        const client = new AppSettings(token);
        return await asyncFunc(client, entityId);
    }/*, { auto: false }*/);

    return { data, error, loading, reload };
    // return data || error || loading 
    // ? { data, error, loading, reload }
    // : { 
    //     data: initial.data, 
    //     error: initial.error, 
    //     loading: initial.loading, 
    //     reload 
    // };
}