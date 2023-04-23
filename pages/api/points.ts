import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { prisma } from "../../lib/prisma"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({"error": "unauthenticated"})
  } else if (req.method === 'GET') {
    const points = await prisma.brotherPoints.findMany({
      where: {
        userId: session?.user?.id
      },
    })
    res.status(200).json(points)
  } else if (req.method === 'POST') {
    const {id, semester} = JSON.parse(req.body)
    const user = await prisma.brotherPoints.findFirst({
      where: {
        userId: id,
        semester: semester,
      },
    })
    res.status(200).json(user)
  }
}