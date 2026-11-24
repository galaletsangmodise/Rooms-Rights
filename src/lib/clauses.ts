import { z } from "zod";

export const clauseSchema = z.object({
  title: z.string().trim().min(3, "Give the clause a title (at least 3 letters).").max(80, "Keep the title under 80 characters."),
  body: z.string().trim().min(10, "Write the clause (at least 10 characters).").max(1000, "Keep the clause under 1000 characters."),
});

export type Clause = {
  id: string;
  title: string;
  body: string;
  active?: boolean;
};
