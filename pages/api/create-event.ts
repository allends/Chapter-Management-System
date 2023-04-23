import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { prisma } from "../../lib/prisma"
import { camelCase, create } from "lodash"
import { Event } from "@prisma/client"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({"error": "unauthenticated"})
  } else if (req.method === 'POST') {
    const data = JSON.parse(req.body)
    console.log(data)
    const response = createEvent(data)
    res.status(200).json(response)
  }
}

export async function createEvent(data: any) {
  const response = await prisma.event.create({
    data: {
      title: data.title,
      semester: data.semester,
      category: data.category,
      value: parseInt(data.value, 10),
      date: new Date(data.date),
      userIds: data.userIds
    }
  })
  // TODO update all the users in the userIds field
  for (const userId of data.userIds) {
    let pointEntry = await prisma.brotherPoints.findFirst({
      where: {
        userId: userId,
        semester: data.semester
      }
    })
    if (!pointEntry) {
      pointEntry = await prisma.brotherPoints.create({
        data: {
          userId: userId,
          semester: data.semester
        }
      })
    }
    await prisma.brotherPoints.update({
      where: {
        id: pointEntry?.id
      },
      data: {
        [`${camelCase(data.category.toLowerCase())}`]: {
          increment: parseInt(data.value , 10)
        }
      }
    })
  }
  return response
}