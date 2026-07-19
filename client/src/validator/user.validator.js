const z = require("zod");

const signUpSchema = z.object({
  name: z.string().min(1, "Name should be atleast a character long"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password should at least be eight characters long "),
  role: z.enum(["user", "admin"]).default("user"),
});
const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password should be at least eight characters long"),
});
module.exports = { signUpSchema, loginSchema };
