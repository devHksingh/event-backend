import { z } from "zod";

const searchParaZodSchema = z.object({
    searchPara: z
        .string()
        .min(1, { message: "Search parameter is requierd" })
        .trim(),
});

export { searchParaZodSchema };
