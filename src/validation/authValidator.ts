import { z } from "zod";

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
