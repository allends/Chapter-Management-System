'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category, Event, Role, Semester, User } from '@prisma/client'
import ReactSelect from 'react-select'
import { genOptionsObj } from '../../../utils/objects'
import { useSession } from 'next-auth/react'
import DatePicker from 'react-date-picker'
import { UserSession } from '../../../lib/types'
import { useForm } from 'react-hook-form'
import { SelectOptions } from '../../events/add/EventForm'

const deleteEvent = async (idText: string) => {
  const resp = await fetch("/api/delete-event?" +  new URLSearchParams({
    eventId: idText,
  }), {
    method: "GET"
  })
  return resp
}

const updateEvent = async (event: Event) => {
  const resp = await fetch('/api/events', {
    method: 'PATCH',
    cache: 'no-cache',
    body: JSON.stringify(event)
  })
  const json = resp.json()
  return json
}

type EventCardProps = {
  event: Event,
}

export const EventCard = ({event}: EventCardProps) => {
  const { register, getValues, reset } = useForm({ defaultValues: {...event}})
  const router = useRouter()
  const userSession  = useSession()
  const session: UserSession = userSession.data as UserSession
  const [editing, setEditing] = useState(false)
  const eventOptions = Object.keys(Category).map(genOptionsObj)
  const valueOptions = [0, 1, 2, 3, 4, 5].map(genOptionsObj)
  const semesterOptions = Object.keys(Semester).map(genOptionsObj)

  const handleDelete = async() => {
    const _result = await deleteEvent(event.id)
    router.refresh()
  }

  const  handleButtonClick = async () => {
    console.log(getValues())
    if (!editing) {
      setEditing(true)
      return
    }
    const formData = getValues()
    setEditing(false)
    await updateEvent(formData)
    router.refresh()
  }

  const handleCancelClick = () => {
    setEditing(false)
    reset()
  }
  const attendedEvent = event.userIds.includes(session?.id ?? "")
 
  return (
    <div className="card card-bordered shadow-md items-center w-1/2 mx-auto p-5">
      { !editing ? (
        <div className="card-body w-96">
          <div className='card-title text-center'> {event.title} - {attendedEvent ? "Attended" : ""} </div>
          <div>{(new Date(event.date)).toDateString()}</div>
          <div>{event.category} - {event.value}</div>
        </div>
      ) : (
        <div className="card-body">
          <input type="text" className='input input-bordered' {...register("title")} />
          <SelectOptions options={eventOptions} name="category" register={register} />
          <SelectOptions options={valueOptions} name="value" register={register} />
          <SelectOptions options={semesterOptions} name="semeseter" register={register} />
          <input type="date" className='input input-bordered' {...register("date")} />
        </div>
      )}
      {session?.role === Role.EBOARD && <div className="card-actions">
        <button className='btn btn-primary' onClick={handleButtonClick}>{editing ? 'Save' : 'Edit Event'}</button>
        {editing && <button className='btn btn-warning' onClick={handleCancelClick}>Cancel</button>}
        <button className="btn btn-error" onClick={handleDelete}>Delete Event</button>
      </div>}
    </div>
  )
}
