import {
    composeContext,
    Content,
    elizaLogger,
    generateObject,
    generateText,
    HandlerCallback,
} from "@elizaos/core";
import {
    type Action,
    type ActionExample,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";
import { z } from "zod";
import { symbolDurationExtractionTemplate } from "../templates/GetTheSymbol";
import { GetSymbolDurationSchema } from "../Schemas/SymbolDurationSchema";
import { fetchQueryResult } from "../APIS/GetTheSummaryAPI";
type GetSymbol = z.infer<typeof GetSymbolDurationSchema> & Content;
const isGetSymbol = (obj: unknown): obj is GetSymbol => {
    return GetSymbolDurationSchema.safeParse(obj).success;
};

export const getcryptoanalysis: Action = {
    name: "getcryptoanalysis",
    similes: ["GET_CRYPTO_ANALYSIS","CRYPTO_ANALYSIS","ANALYZE_L1_COINS","getcryptoanalysis"],
    description:
        "Get the analysis of the L1 crypto currency",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        try {
            let currentState = state;
            if (!currentState) {
                currentState = (await runtime.composeState(message)) as State;
            } else {
                currentState = await runtime.updateRecentMessageState(
                    currentState
                );
            }
            // console.log("currentState", currentState);
            const SymbolAndTime = composeContext({
                state: currentState,
                template: symbolDurationExtractionTemplate,
            });
            // console.log(SymbolAndTime)
            const result = await generateObject({
                runtime,
                context: SymbolAndTime,
                modelClass: ModelClass.SMALL,
                schema: GetSymbolDurationSchema,
            });
            // console.log("result", result);
            // return;
            if (!isGetSymbol(result.object)) {
                callback(
                    {
                        text: `Somethig went wrong. Please try again.`,
                    },
                    []
                );
                return
            }
            const content = result.object;
            console.log("DATA",content);
            if (content.symbol==undefined || content.symbol==undefined) {
                callback(
                    {
                        text: `Somethig went wrong. Please try again.`,
                    },
                    []
                );
                return false;
                
            }
            callback(
                {
                    text: `Hoping into the market to get the analysis.`,
                },
                []
            );
            const SummaryData = await fetchQueryResult(content.symbol);
            console.log(SummaryData)
            console.log(typeof SummaryData)
            const llmPrompt = `
📊 **Market Summary Report**  

Summarize the following **24-hour market data** in a structured, bot-style format. The summary should:  
- 🔍 **Strictly focus on available data** without assuming missing values.  
- 🔄 **Highlight key price movements** (e.g., current price, % change, high/low).  
- 🚀 **Be concise, engaging, and formatted for quick reading** using emojis.  
- ❌ **Avoid instructions or explanations—output should be a clean, formatted summary.**  

---


⚠️ *Note: Market conditions change rapidly. Data reflects the most recent available update.*  
\\\`\`\`

---

Here is the data to summarize:  

\\\`\`\`json
\ ${JSON.stringify(SummaryData, null, 2)}
\\\`\`\`  

Ensure the output is **clear, structured, and in a bot-like format** without extra explanations. 🚀
`;

            console.log(llmPrompt)
            const response = await generateText({
                runtime,
                context: llmPrompt,
                modelClass: ModelClass.SMALL,
            });
            callback(
                {
                    text: `response - - ${response}`,
                },
                []
            );
        } 
    catch (error) {
        callback(
            {
                text: error.message,
            },
            []
        );
        return;
        }
    },
    examples:[
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "How's the market today?"
                }
            },
            {
                "user": "{{user2}}",
                "content": {
                    "action": "getcryptoanalysis"
                }
            }
        ],
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "What's the status of BNB?"
                }
            },
            {
                "user": "{{user2}}",
                "content": {
                    "action": "getcryptoanalysis",
                    
                }
            }
        ],
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "How are L1 coins performing?"
                }
            },
            {
                "user": "{{user2}}",
                "content": {
                    "action": "getcryptoanalysis",
                }
            }
        ],
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "Give me a summary of the market."
                }
            },
            {
                "user": "{{user2}}",
                "content": {
                    "action": "getcryptoanalysis"
                }
            }
        ]
    ] as ActionExample[][],
} as Action;