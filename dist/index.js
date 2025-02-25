// src/actions/GetCryptoData.ts
import {
  composeContext,
  generateObject,
  generateText
} from "@elizaos/core";
import {
  ModelClass
} from "@elizaos/core";

// src/templates/GetTheSymbol.ts
var symbolDurationExtractionTemplate = `
Extract the **symbol** from the given text message.

- **symbol** (string): The assets mentioned in the message.  
  - Format the symbols as a string in the format **"('SYMBOL1','SYMBOL2')"**.
  - If no specific symbol is present in the message, default to **"('BNB','SOL','ETH')"**.

Provide the values in the following JSON format:

\\json
{
    "symbol": "('SYMBOL1','SYMBOL2')"
}
\\
### **Example Requests & Responses:**

#### **General Market Overview Requests:**  
##### **Example request:**  
*"How's the market today?"*  
**Example response:**  
\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\
##### **Example request:**  
*"Give me a summary of the market."*  
**Example response:**  
\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\
##### **Example request:**  
*"What's the overall trend in crypto today?"*  
**Example response:**  
\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\
---

#### **Single Symbol Requests:**  
##### **Example request:**  
*"What's the status of BNB?"*  
**Example response:**  
\\json
{
    "symbol": "('BNB')"
}
\\
##### **Example request:**  
*"Tell me about SOL?"*  
**Example response:**  
\\json
{
    "symbol": "('SOL')"
}
\\
##### **Example request:**  
*"How is ETH doing today?"*  
**Example response:**  
\\json
{
    "symbol": "('ETH')"
}
\\
---

#### **Multiple Symbols Requests:**  
##### **Example request:**  
*"What's happening with BNB and SOL?"*  
**Example response:**  
\\json
{
    "symbol": "('BNB','SOL')"
}
\\
##### **Example request:**  
*"Check the prices for BTC, ETH, and DOGE."*  
**Example response:**  
\\json
{
    "symbol": "('BTC','ETH','DOGE')"
}
\\
##### **Example request:**  
*"Give me updates on AVAX, MATIC, and XRP."*  
**Example response:**  
\\json
{
    "symbol": "('AVAX','MATIC','XRP')"
}
\\
---

#### **Category-Based Requests (e.g., L1 Coins, Meme Coins, etc.):**  
##### **Example request:**  
*"How are L1 coins performing?"*  
**Example response:**  
\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\
##### **Example request:**  
*"What's up with meme coins?"*  
**Example response:**  
\\json
{
    "symbol": "('DOGE','SHIB','PEPE')"
}
\\
##### **Example request:**  
*"How are DeFi tokens doing?"*  
**Example response:**  
\\json
{
    "symbol": "('UNI','AAVE','CAKE')"
}
\\
---

#### **Requests with Unclear Symbols (Defaulting to Preset List):**  
##### **Example request:**  
*"What\u2019s trending today?"*  
**Example response:**  
\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\
##### **Example request:**  
*"Give me insights on the crypto market."*  
**Example response:**  
\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\
### **Context Handling:**  
- If specific symbols are found in the message, extract them and format them correctly.  
- If no specific symbols are mentioned, return the default value **"('BNB','SOL','ETH')"**.  
- Consider category-based phrases (e.g., "L1 coins," "DeFi tokens") and map them to relevant symbols.

Recent user messages for context:  
{{recentMessages}}

Extract and return the symbols in the specified format. If no relevant symbols are found, return the default value.`;

// src/Schemas/SymbolDurationSchema.ts
import { z } from "zod";
var GetSymbolDurationSchema = z.object({
  symbol: z.string().refine(
    (val) => /^\('([A-Z]+')(,'[A-Z]+')*\)$/.test(val),
    {
      message: "Symbol should be in the format ('SYMBOL1','SYMBOL2')"
    }
  )
  // duration: z.string().default("1440").refine(
  //     (val) => /^\d+$/.test(val),
  //     {
  //         message: "Time should be an integer in string format",
  //     }
  // ),
});

// src/APIS/GetTheSummaryAPI.ts
import { DuneClient, QueryParameter } from "@duneanalytics/client-sdk";
var DUNE_API_KEY = process.env.DUNE_API_KEY || "lj0mWMA3BT9aJiKcTSi50B4hAFWKUEKP";
var client = new DuneClient(DUNE_API_KEY);
var queryID = 4764225;
var fetchQueryResult = async (sym) => {
  console.log(sym);
  try {
    const params = {
      queryId: queryID,
      query_parameters: [
        QueryParameter.text("symbols", sym),
        QueryParameter.text("time", "1440")
        // QueryParameter.number("NumberField", 3.1415926535),
        // QueryParameter.date("DateField", "2022-05-04 00:00:00"),
        // QueryParameter.enum("ListField", "Option 1"),
      ]
    };
    const executionResult = await client.runQuery(params);
    return executionResult.result?.rows;
  } catch (error) {
    console.error("Error running query:", error);
  }
};

// src/actions/GetCryptoData.ts
var isGetSymbol = (obj) => {
  return GetSymbolDurationSchema.safeParse(obj).success;
};
var getcryptoanalysis = {
  name: "getcryptoanalysis",
  similes: ["GET_CRYPTO_ANALYSIS", "CRYPTO_ANALYSIS", "ANALYZE_L1_COINS", "getcryptoanalysis"],
  description: "Get the analysis of the L1 crypto currency",
  validate: async (runtime, message) => {
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      let currentState = state;
      if (!currentState) {
        currentState = await runtime.composeState(message);
      } else {
        currentState = await runtime.updateRecentMessageState(
          currentState
        );
      }
      const SymbolAndTime = composeContext({
        state: currentState,
        template: symbolDurationExtractionTemplate
      });
      const result = await generateObject({
        runtime,
        context: SymbolAndTime,
        modelClass: ModelClass.SMALL,
        schema: GetSymbolDurationSchema
      });
      if (!isGetSymbol(result.object)) {
        callback(
          {
            text: `Somethig went wrong. Please try again.`
          },
          []
        );
        return;
      }
      const content = result.object;
      console.log("DATA", content);
      if (content.symbol == void 0 || content.symbol == void 0) {
        callback(
          {
            text: `Somethig went wrong. Please try again.`
          },
          []
        );
        return false;
      }
      callback(
        {
          text: `Hoping into the market to get the analysis.`
        },
        []
      );
      const SummaryData = await fetchQueryResult(content.symbol);
      console.log(SummaryData);
      console.log(typeof SummaryData);
      const llmPrompt = `
\u{1F4CA} **Market Summary Report**  

Summarize the following **24-hour market data** in a structured, bot-style format. The summary should:  
- \u{1F50D} **Strictly focus on available data** without assuming missing values.  
- \u{1F504} **Highlight key price movements** (e.g., current price, % change, high/low).  
- \u{1F680} **Be concise, engaging, and formatted for quick reading** using emojis.  
- \u274C **Avoid instructions or explanations\u2014output should be a clean, formatted summary.**  

---


\u26A0\uFE0F *Note: Market conditions change rapidly. Data reflects the most recent available update.*  
\\\`\`\`

---

Here is the data to summarize:  

\\\`\`\`json
 ${JSON.stringify(SummaryData, null, 2)}
\\\`\`\`  

Ensure the output is **clear, structured, and in a bot-like format** without extra explanations. \u{1F680}
`;
      console.log(llmPrompt);
      const response = await generateText({
        runtime,
        context: llmPrompt,
        modelClass: ModelClass.SMALL
      });
      callback(
        {
          text: `response - - ${response}`
        },
        []
      );
    } catch (error) {
      callback(
        {
          text: error.message
        },
        []
      );
      return;
    }
  },
  examples: [
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
          "action": "getcryptoanalysis"
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
          "action": "getcryptoanalysis"
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
  ]
};

// src/index.ts
var dunePlugin = {
  name: "dunePlugin",
  description: "Agent dunePlugin with basic actions and evaluators",
  actions: [
    getcryptoanalysis
  ],
  evaluators: [],
  providers: []
};
var index_default = dunePlugin;
export {
  index_default as default,
  dunePlugin
};
//# sourceMappingURL=index.js.map