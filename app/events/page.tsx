'use client'
import { Category, Event, Semester, User } from '@prisma/client'
import { startCase } from 'lodash'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import ReactSelect from 'react-select'
import { genOptionsObj } from '../../utils/objects'

const getUsers = async () => {
  const response = await fetch('/api/users', {
    method: 'GET'
  })
  const users = await response.json()
  return users
}

const getEvents = async () => {
  const resp = await fetch('/api/events', {
    method: 'GET',
    cache: 'no-cache'
  })
  const json = resp.json()
  return json
}

const createEvent = async (data: any) => {
  const resp = await fetch('/api/create-event', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const json = resp.json()
  console.log(json)
  return json
}

const EventsPage = () => {

  const user = useSession()
  const [events, setEvents] = useState<Event[] | null>([])
  const [users, setUsers] = useState<User[] | null>()
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false)
  const [eventName, setEventName] = useState<string>("")
  const [eventType, setEventType] = useState<Category | null>()
  const [eventSemester, setEventSemester] = useState<Semester>(Semester.S23)
  const [eventValue, setEventValue] = useState<number>(0)

  const [selectedUsers, setSelectedUsers] = useState<any>([])
  const eventOptions = Object.keys(Category).map(genOptionsObj)
  const valueOptions = [0, 1, 2, 3, 4, 5].map(genOptionsObj)
  const semesterOptions = Object.keys(Semester).map(genOptionsObj)
  useEffect(() => {
    getEvents().then((resp) => setEvents(resp))
    getUsers().then((resp) => setUsers(resp))
  }, [])

  const toggleEventModalOpen = () => {
    setIsEventModalOpen((oldValue) => !oldValue)
  }

  if ((events as any).error !== undefined || events === null) {
    return <div>Error</div>
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

  const isUserSelected = (user: User) => {
    return selectedUsers.find((selectedUser: User) => user.id === selectedUser.id) !== undefined
  }

  const handleCreateEventSubmit = () => {
    const eventObj = {
      title: eventName,
      category: eventType,
      value: eventValue,
      semester: eventSemester,
      userIds: selectedUsers.map((user: User) => user.id)
    }
    createEvent(eventObj)
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="text-center font-semibold text-3xl m-5">Events</div>
        <button className='btn btn-circle btn-secondary w-40' onClick={toggleEventModalOpen}>Create Event</button>
      </div>
      {
        events.map((event: Event) => {
          return <div>{event.title}</div>
        })
      }
      <ReactModal isOpen={isEventModalOpen} onRequestClose={() => setIsEventModalOpen(false)}>
        <div className="flex flex-col w-full items-center">
          <div className="font-semibold text-xl">
            Create an Event
          </div>
        </div>
        <div className='flex flex-row h-full gap-10'>
          <div className='bg-base-100 h-full'>
            <div className='text-center text-lg font-medium'>Select Attendees</div>
            <table className='table'>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Status</th>
              </tr>
              {users?.map((user: User) => (
                <tr onClick={() => handleClick(user)}
                  className={`hover:cursor-pointer hover:bg-base-300 ${isUserSelected(user) ? "bg-base-200" : ""}`} key={user.id}>
                  <td>
                    <div className='avatar'>
                      <div className='w-10 rounded-full'>
                        <img src={user.image ?? ""} />
                      </div>
                    </div>
                  </td>
                  <td className={``}>{user.name}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </table>
          </div>
          <div className="flex flex-col gap-5">
            <div className='text-center text-lg font-medium'>Name Category and Point Value</div>
            <input type="text" className="input input-bordered input-sm" placeholder='Name...' value={eventName} onChange={e => setEventName(e.target.value)} />
            <ReactSelect
              options={eventOptions}
              onChange={(option) => setEventType(option?.value)}
            />
            <ReactSelect
              options={valueOptions}
              onChange={(option) => setEventValue(option?.value)}
            />
            <ReactSelect
              options={semesterOptions}
              onChange={(option) => setEventSemester(option?.value)}
            />
          </div>
          <div>
            <button className='btn' onClick={handleCreateEventSubmit}>Create</button>
          </div>
        </div>

      </ReactModal>
    </div>
  )
}

export default EventsPage
