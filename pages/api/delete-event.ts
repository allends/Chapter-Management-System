import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { prisma } from "../../lib/prisma"
import { camelCase } from "lodash"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({ "error": "unauthenticated" })
  } else if (req.method === 'GET') {
    const { eventId } = req.query
    const response = await deleteEvent(eventId)

    res.status(Object.keys(response).includes('status') ? 500 : 200).json(response)
  }
}

export async function deleteEvent(eventId: string) {
  const targetEvent = await prisma.event.findUnique({
    where: {
      id: eventId
    }
  })
  console.log(targetEvent)
  // console.log(queryString.get('eventId'))

  if (!targetEvent) {
    return {'status': 'failure'}
  }

  for (const userId of targetEvent.userIds) {
    const pointEntry = await prisma.brotherPoints.findFirst({
      where: {
        userId: userId,
        semester: targetEvent.semester
      }
    })
    if (!pointEntry) { continue }
    await prisma.brotherPoints.update({
      where: {
        id: pointEntry.id
      },
      data: {
        [`${camelCase(targetEvent.category.toLowerCase())}`]: {
          decrement: targetEvent.value
        }
      }
    })
  }

  const finalResponse = await prisma.event.delete({
    where: {
      id: eventId
    }
  })
  return finalResponse
}