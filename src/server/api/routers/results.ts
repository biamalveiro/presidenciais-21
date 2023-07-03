import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const resultsRouter = createTRPCRouter({
  getAllParishes: publicProcedure.query(async ({ ctx }) => {
    const parishes = await ctx.prisma.parish.findMany({
      select: {
        dicofre: true,
        name: true,
        county: true,
        region: true,
        x: true,
        y: true,
        outlier: true,
        votes: true,
        distanceToTotal: true,
      },
    });
    return parishes;
  }),
  getParishResults: publicProcedure
    .input(
      z.object({
        dicofre: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!input.dicofre) return [];
      const results = await ctx.prisma.result.findMany({
        where: {
          dicofre: input.dicofre,
        },
      });
      return results;
    }),
  getTotalResults: publicProcedure.query(async ({ ctx }) => {
    const results = await ctx.prisma.total.findMany();
    return results;
  }),
});
