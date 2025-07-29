import {  sendMessage } from "@/controller/message.controller";
import { protectRoute } from "@/middleware/auth.middleware";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`method ${req.method} is not allowed `);
  }
 return await protectRoute(sendMessage)(req, res);
}
