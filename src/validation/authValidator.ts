import { z } from "zod";

// export const validateRegisterRequest = (data: object) => {
//   const schema = z.object({
//     fullname: z.string(),
//     email: z.string().email(),
//     password: z.string().min(8).max(30),
//   });
//   const result = schema.safeParse(data);
//   return {
//     validationSuccess: result.success,
//     validatedData: result.data ?? null,
//     validationError: result.error ?? null,
//     validationResultObj: result,
//   };
// };

// export const validateLoginRequest = (data: object) => {
//   const schema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8).max(30),
//   });
//   const result = schema.safeParse(data);
//   return {
//     validationSuccess: result.success,
//     validatedData: result.data ?? null,
//     validationError: result.error ?? null,
//     validationResultObj: result,
//   };
// };

export const validateRegisterRequest = (data: object) => {
  const schema = z.object({
    fullname: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(30),
  });
  return schema.parse(data);
};

export const validateLoginRequest = (data: object) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(30),
  });
  return schema.parse(data);
};
