import type { Plugin } from "@elizaos/core";
import { getcryptoanalysis } from "./actions/GetCryptoData";


export const dunePlugin: Plugin = {
    name: "dunePlugin",
    description: "Agent dunePlugin with basic actions and evaluators",
    actions: [
        getcryptoanalysis
    ],
    evaluators: [],
    providers: [],
};
export default dunePlugin;
