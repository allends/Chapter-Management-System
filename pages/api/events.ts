import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { prisma } from "../../lib/prisma"
import { Event } from "@prisma/client"
import { camelCase } from "lodash"
import { deleteEvent } from "./delete-event"
import { createEvent } from "./create-event"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({"error": "unauthenticated"})
  } else if (req.method === 'GET') {
    const points = await prisma.event.findMany()
    res.status(200).json(points)
  } else if (req.method === 'PATCH') {
    const data = req.body
    const json_data = JSON.parse(data)
    const _deleteResponse = await deleteEvent(json_data.id)
    const createResponse = await createEvent(json_data)

    res.status(200).json(createResponse)
  }
}