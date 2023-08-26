import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env["SECRET"]!);

export const getIdFromToken = async (token?: string) => {
  //check for token
  if (!token) {
    throw new Error("No token found");
  }

  const { payload } = await jwtVerify(token, secret);

  if (
    typeof payload.userId !== "string" ||
    !payload.userId // || !mongoose.isValidObjectId(payload.userId) /* not working in edge env in middleware */
  )
    throw new Error("Invalid userId");

  return payload.userId;
};
