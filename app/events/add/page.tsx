import React from 'react'
import { prisma } from '../../../lib/prisma'
import { EventForm } from './EventForm'

const getUsers = async () => {
  const users = await prisma.user.findMany()
  return users
}

const CreateEvent = async () => {
  const users = await getUsers()
  return (
    <div>
      <EventForm users={users} />
    </div>
  )
}

export default CreateEvent