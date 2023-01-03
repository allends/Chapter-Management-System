import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import prisma from "../../lib/prisma"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({"error": "unauthenticated"})
  }
  if (req.method === 'GET') {
    const user = await prisma.semesterPoints.findMany()
    res.status(200).json(user)
  } else if (req.method === 'POST') {
  }
}