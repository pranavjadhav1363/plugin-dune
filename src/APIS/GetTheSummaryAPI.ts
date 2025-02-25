import { DuneClient, QueryParameter } from "@duneanalytics/client-sdk";

const DUNE_API_KEY: string = process.env.DUNE_API_KEY || "";
const client = new DuneClient(DUNE_API_KEY);

const queryID: number = process.env.DUNE_QUERY_ID||"";

export const fetchQueryResult = async (sym: string,): Promise<any> => {
  console.log( sym )
  try {
    const params = {
      queryId: queryID,
      query_parameters: [
        QueryParameter.text("symbols", sym),
        QueryParameter.text("time", '1440'),

        // QueryParameter.number("NumberField", 3.1415926535),
        // QueryParameter.date("DateField", "2022-05-04 00:00:00"),
        // QueryParameter.enum("ListField", "Option 1"),
      ],
    };

    const executionResult = await client.runQuery(params);
    return executionResult.result?.rows;
  } catch (error) {
    console.error("Error running query:", error);
  }
};
