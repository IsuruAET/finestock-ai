import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { AppError } from "./errorMiddleware";
import { ValidationTarget } from "../types";

export const validate = (
  schema: z.ZodObject<Partial<Record<ValidationTarget, z.ZodTypeAny>>>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Build validation object with only defined schema parts
      const validationData: Record<string, unknown> = {};
      const schemaShape = schema.shape as Partial<
        Record<ValidationTarget, z.ZodTypeAny>
      >;

      if (schemaShape.body) validationData.body = req.body;
      if (schemaShape.query) validationData.query = req.query;
      if (schemaShape.params) validationData.params = req.params;

      // Validate the request structure
      const result = schema.parse(validationData);

      // Replace request properties with validated data
      if (result.body) req.body = result.body;
      if (result.query) req.query = result.query as typeof req.query;
      if (result.params) req.params = result.params as typeof req.params;

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return next(
          new AppError(
            `Validation failed: ${errors
              .map((e: { message: string }) => e.message)
              .join(", ")}`,
            400
          )
        );
      }
      next(error);
    }
  };
};
