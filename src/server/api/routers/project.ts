import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db"; // Import the exported prisma client as 'db'

export const projectRouter = createTRPCRouter({
  // Procedure to create a new project
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const project = await db.project.create({ // Use 'db' instead of 'prisma'
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return project;
    }),

  // Procedure to get all projects
  getAll: publicProcedure
    .query(async () => {
      const projects = await db.project.findMany(); // Use 'db' instead of 'prisma'
      return projects;
    }),

  // Procedure to get a single project by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const project = await db.project.findUnique({ // Use 'db' instead of 'prisma'
        where: { id: input.id },
      });
      return project;
    }),

  // Procedure to update a project
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const project = await db.project.update({ // Use 'db' instead of 'prisma'
        where: { id },
        data,
      });
      return project;
    }),

  // Procedure to delete a project
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // Add cascade delete logic if necessary (e.g., delete related datasets)
      // For now, simple delete
      await db.project.delete({ // Use 'db' instead of 'prisma'
        where: { id: input.id },
      });
      return { success: true }; // Indicate successful deletion
    }),
}); 