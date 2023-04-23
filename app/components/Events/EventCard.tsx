'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category, Event, Role, Semester, User } from '@prisma/client'
import ReactSelect from 'react-select'
import { genOptionsObj } from '../../../utils/objects'
import { useSession } from 'next-auth/react'
import DatePicker from 'react-date-picker'
import { UserSession } from '../../../lib/types'

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
  users: User[]
}

export const EventCard = ({event, users}: EventCardProps) => {

  const router = useRouter()
  const userSession  = useSession()
  const session: UserSession = userSession.data as UserSession
  const [editing, setEditing] = useState(false)
  const [eventName, setEventName] = useState<string>(event.title)
  const [eventType, setEventType] = useState<Category | null>(event.category)
  const [eventSemester, setEventSemester] = useState<Semester>(event.semester)
  const [eventValue, setEventValue] = useState<number>(event.value)
  const [value, onChange] = useState(new Date(event.date))

  const [selectedUsers, setSelectedUsers] = useState<any>(users.filter((user) => event.userIds.includes(user.id)))
  const eventOptions = Object.keys(Category).map(genOptionsObj)
  const valueOptions = [0, 1, 2, 3, 4, 5].map(genOptionsObj)
  const semesterOptions = Object.keys(Semester).map(genOptionsObj)

  const handleDelete = async() => {
    const _result = await deleteEvent(event.id)
    router.refresh()
  }

  const  handleButtonClick = async () => {
    if (!editing) {
      setEditing(true)
      return
    }
    const eventObj: Event = {
      id: event.id,
      title: eventName,
      category: eventType ?? event.category,
      value: eventValue,
      semester: eventSemester,
      date: value,
      userIds: selectedUsers.map((user: User) => user.id)
    }
    setEditing(false)
    await updateEvent(eventObj)
    router.refresh()
  }

  const handleClick = (user: any) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([
        user,
        ...selectedUsers
      ])
    } else {
      setSelectedUsers(selectedUsers.filter((u: any) => u.id !== user.id))
    }
  }

  const handleCancelClick = () => {
    setEditing(false)
    setEventName(event.title)
    setEventType(event.category)
    setEventSemester(event.semester)
    setEventValue(event.value)
    onChange(new Date(event.date))
    setSelectedUsers(users.filter((user) => event.userIds.includes(user.id)))
  }
 
  const isUserSelected = (user: User) => {
    return selectedUsers.find((selectedUser: User) => user.id === selectedUser.id) !== undefined
  }

  return (
    <div className="card card-bordered shadow-md items-center w-1/2 mx-auto p-5">
      {editing ? <input className='input input-bordered' value={eventName} onChange={e => setEventName(e.target.value)} /> : <div className='card-title text-center'> {event.title} </div>}
      {event.userIds.includes(session?.id ?? "") && <div>Attended</div>}
      <div className="card-body">
        {editing ? (
          <ReactSelect
          options={eventOptions}
          value={eventOptions.find((option) => option.value === eventType)}
          onChange={(option) => setEventType(option?.value)}
        />
        ) : <div>{event.category}</div>}
        {editing ? (
          <ReactSelect
            options={valueOptions}
            value={valueOptions.find((option) => option.value === eventValue)}
            onChange={(option) => setEventValue(option?.value)}
          />
        ) : <div>{event.value}</div>}
        {editing ? <DatePicker onChange={onChange} value={value} /> : <div>{(new Date(event.date)).toDateString()}</div>}
        {!editing && (
        <div>{event.semester}</div>)}
        {session?.role === Role.EBOARD && <div className="card-actions">
          <button className='btn btn-primary' onClick={handleButtonClick}>{editing ? 'Save' : 'Edit Event'}</button>
          {editing && <button className='btn btn-warning' onClick={handleCancelClick}>Cancel</button>}
          <button className="btn btn-error" onClick={handleDelete}>Delete Event</button>
        </div>}
      </div>
    </div>
  )
}
