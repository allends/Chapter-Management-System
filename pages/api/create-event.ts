import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import prisma from "../../lib/prisma"
import { camelCase } from "lodash"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({"error": "unauthenticated"})
  } else if (req.method === 'POST') {
    const data = JSON.parse(req.body)
    const response = await prisma.event.create({
      data: {
        title: data.title,
        semester: data.semester,
        category: data.category,
        value: data.value,
        userIds: data.userIds
      }
    })
    // TODO update all the users in the userIds field
    for (const userId of data.userIds) {
      const pointEntry = await prisma.brotherPoints.findFirst({
        where: {
          userId: userId,
          semester: data.semester
        }
      })
      await prisma.brotherPoints.update({
        where: {
          id: pointEntry?.id
        },
        data: {
          [`${camelCase(data.category.toLowerCase())}`]: {
            increment: data.value
          }
        }
      })
    }
    res.status(200).json(response)
  }
}