import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import prisma from "../../lib/prisma"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({"error": "unauthenticated"})
  }
  if (req.method === 'GET') {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email
      },
    })
    res.status(200).json(user)
  }else if (req.method === 'PATCH') {
    const data = req.body
    const json_data = JSON.parse(data)
    const response = await prisma.user.update({
      where: {
        email: session?.user?.email ?? ""
      },
      data: json_data
    })
    res.status(200).json(response)
  }
  
}