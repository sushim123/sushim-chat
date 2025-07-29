import { deleteMessage } from "@/controller/message.controller";
import { protectRoute } from "@/middleware/auth.middleware";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`method ${req.method} is not allowed`);
  }
   deleteMessage(req, res);
}


