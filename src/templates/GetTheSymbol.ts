export const symbolDurationExtractionTemplate = `
Extract the **symbol** from the given text message.

- **symbol** (string): The assets mentioned in the message.  
  - Format the symbols as a string in the format **"('SYMBOL1','SYMBOL2')"**.
  - If no specific symbol is present in the message, default to **"('BNB','SOL','ETH')"**.

Provide the values in the following JSON format:

\\\json
{
    "symbol": "('SYMBOL1','SYMBOL2')"
}
\\\

### **Example Requests & Responses:**

#### **General Market Overview Requests:**  
##### **Example request:**  
*"How's the market today?"*  
**Example response:**  
\\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\\

##### **Example request:**  
*"Give me a summary of the market."*  
**Example response:**  
\\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\\

##### **Example request:**  
*"What's the overall trend in crypto today?"*  
**Example response:**  
\\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\\

---

#### **Single Symbol Requests:**  
##### **Example request:**  
*"What's the status of BNB?"*  
**Example response:**  
\\\json
{
    "symbol": "('BNB')"
}
\\\

##### **Example request:**  
*"Tell me about SOL?"*  
**Example response:**  
\\\json
{
    "symbol": "('SOL')"
}
\\\

##### **Example request:**  
*"How is ETH doing today?"*  
**Example response:**  
\\\json
{
    "symbol": "('ETH')"
}
\\\

---

#### **Multiple Symbols Requests:**  
##### **Example request:**  
*"What's happening with BNB and SOL?"*  
**Example response:**  
\\\json
{
    "symbol": "('BNB','SOL')"
}
\\\

##### **Example request:**  
*"Check the prices for BTC, ETH, and DOGE."*  
**Example response:**  
\\\json
{
    "symbol": "('BTC','ETH','DOGE')"
}
\\\

##### **Example request:**  
*"Give me updates on AVAX, MATIC, and XRP."*  
**Example response:**  
\\\json
{
    "symbol": "('AVAX','MATIC','XRP')"
}
\\\

---

#### **Category-Based Requests (e.g., L1 Coins, Meme Coins, etc.):**  
##### **Example request:**  
*"How are L1 coins performing?"*  
**Example response:**  
\\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\\

##### **Example request:**  
*"What's up with meme coins?"*  
**Example response:**  
\\\json
{
    "symbol": "('DOGE','SHIB','PEPE')"
}
\\\

##### **Example request:**  
*"How are DeFi tokens doing?"*  
**Example response:**  
\\\json
{
    "symbol": "('UNI','AAVE','CAKE')"
}
\\\

---

#### **Requests with Unclear Symbols (Defaulting to Preset List):**  
##### **Example request:**  
*"What’s trending today?"*  
**Example response:**  
\\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\\

##### **Example request:**  
*"Give me insights on the crypto market."*  
**Example response:**  
\\\json
{
    "symbol": "('BNB','SOL','ETH')"
}
\\\

### **Context Handling:**  
- If specific symbols are found in the message, extract them and format them correctly.  
- If no specific symbols are mentioned, return the default value **"('BNB','SOL','ETH')"**.  
- Consider category-based phrases (e.g., "L1 coins," "DeFi tokens") and map them to relevant symbols.

Recent user messages for context:  
{{recentMessages}}

Extract and return the symbols in the specified format. If no relevant symbols are found, return the default value.`
;