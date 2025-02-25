import { z } from "zod";

export const GetSymbolDurationSchema = z.object({
    symbol: z.string().refine(
        (val) => /^\('([A-Z]+')(,'[A-Z]+')*\)$/.test(val),
        {
            message: "Symbol should be in the format ('SYMBOL1','SYMBOL2')",
        }
    ),
    // duration: z.string().default("1440").refine(
    //     (val) => /^\d+$/.test(val),
    //     {
    //         message: "Time should be an integer in string format",
    //     }
    // ),
})