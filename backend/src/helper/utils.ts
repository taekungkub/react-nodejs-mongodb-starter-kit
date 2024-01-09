import { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { secretJWT } from "../config/global-config";
import { UserTy } from "../types/user.type";

const saltRounds = 10;

export function errorResponse(statusCode: Number = 404, type: string, desc?: any) {
  return {
    statusCode: statusCode,
    detail: "Error",
    error: {
      type: type,
      description: desc,
    },
  };
}

export function successResponse(data: any) {
  return {
    statusCode: 200,
    detail: "Success",
    data: data,
  };
}

export function getTokenBearer(req: Request) {
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    return bearerToken;
  }

  return null;
}

export function hashPassword(myPlaintextPassword: string) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const result = await bcrypt.hashSync(myPlaintextPassword, saltRounds);
      resolve(result);
    } catch (error) {
      reject(null);
    }
  });
}

export function comparePassword(myPlaintextPassword: string, passwordHash: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await bcrypt.compareSync(myPlaintextPassword, passwordHash);
      resolve(result);
    } catch (error) {
      reject(null);
    }
  });
}

export async function jwtTokenGenerate(user: UserTy) {
  const cleanUser = {
    email: user.email,
    username: user.username,
  };
  const accessToken = jwt.sign(cleanUser, secretJWT, { expiresIn: "1h" });
  return accessToken;
}
