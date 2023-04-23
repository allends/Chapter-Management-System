import { Event } from '@prisma/client'
import React from 'react'
import { EventCard } from '../components/Events/EventCard'
import Link from 'next/link'
import { prisma } from '../../lib/prisma'

const getUsers = async () => {
  const users = await prisma.user.findMany()
  return users
}

const getEvents = async () => {
  const events = await prisma.event.findMany()
  return events
}

const EventsPage = async () => {

  const events = await getEvents()
  const users = await getUsers()

  return (
    <div className=' flex flex-col justify-center'>
      <Link className="btn btn-ghost" href='/events/add'>Create Event</Link>
      {
        events?.sort((a, b) => a.date.getTime() - b.date.getTime()).map((event: Event) => {
          return <EventCard key={event.id} event={event} users={users} />
        })
      }
    </div>
  )
}

export default EventsPage
