'use client'
import { Class, Semester, Status, User } from '@prisma/client'
import { startCase } from 'lodash'
import { useSession } from 'next-auth/react'
import Select from 'react-select'
import React, { SetStateAction, useEffect, useState } from 'react'

const getUsers = async () => {
  const response = await fetch('/api/users', {
    method: 'GET'
  })
  const users = await response.json()
  return users
}

const getUserPoints = async (user : any, semester: string) => {
  const resp = await fetch('/api/points', {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify({
      id: user.id,
      semester: semester
    })
  })
  const json = resp.json()
  return json
}

const Message = () => {

  const session = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [message, setMessage] = useState<string>("")
  const [semester, setSemester] = useState<Semester>(Semester.S23)
  const [selectedUsers, setSelectedUsers] = useState<any>([])

  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])
  const [selectedClasses, setSelectedClasses] = useState<Class[]>([])

  const genOptionsObj = (option: any) => {
    const obj = {
      'value': option,
      'label': startCase(option)
    }
    return obj
  }

  const handleClassesChange = (e: any) => {
    const classesSelected = e.map((value: any) => value.value)
    setSelectedClasses(classesSelected)
  }

  const handleStatusChange = (e: any) => {
    const statusSelected = e.map((value: any) => value.value)
    setSelectedStatuses(statusSelected)
  }

  const statusOptions = Object.keys(Status).map(genOptionsObj)
  const classOptions = Object.keys(Class).map(genOptionsObj)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      return
    }
    getUsers().then((response) => setUsers(response))
  }, [])
  if (session.status === 'unauthenticated') {
    return <div className='text-center'>Please sign in</div>
  }

  if (users.length === 0) {
    return <div className='text-center'>Loading...</div>
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

  const handleSend = async () => {

    selectedUsers.forEach( async (user: any) => {
      // mappings for current semesters points
      const points = await getUserPoints(user, semester)
      console.log(points)

      const mapObj: any = {
        '{name}': user.name,
        '{fund}': points?.fundraising ?? 0,
        '{cs}': points?.communityService ?? 0,
        '{bh}': points?.brotherhood ?? 0,
        '{pl}': points?.pledge ?? 0,
        '{pd}': points?.professionalDevelopment ?? 0,
        '{sem}': semester,
      };

      let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      const str = message.replace(re, function (matched) {
        return mapObj[matched];
      });

      // TODO send the messages with twilio api
      console.log(str)
    })
  }

  const isUserSelected = (user: User) => {
    return selectedUsers.find((selectedUser: User) => user.id === selectedUser.id) !== undefined
  }

  const userFilter = (user: User) => {
    const classesHit = selectedClasses.length === 0 || selectedClasses.includes(user.class) 
    const statusHit = selectedStatuses.length === 0 || selectedStatuses.includes(user.status)
    return classesHit && statusHit
  }

  return (
    <div className='flex flex-col'>
      <Select 
        isMulti 
        isSearchable 
        placeholder="Filter by Class"
        options={classOptions}
        onChange={handleClassesChange}
        className="w-1/2 mx-auto my-3"
        />
      <Select 
        isMulti 
        isSearchable 
        placeholder="Filter by Status"
        options={statusOptions}
        onChange={handleStatusChange}
        className="w-1/2 mx-auto my-3"
      />
    <div className='flex flex-row items-center justify-center gap-5 m-3'>
      {Object.keys(Semester).map((key) => (
        <button className={`btn ${semester !== key && 'btn-outline'} btn-sm`} onClick={() => setSemester(key as Semester)}>{key}</button>
      ))}
    </div>
    <div className='flex flex-row h-full'>
      <div className='bg-base-100 h-full'>
        <table className='table'>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Status</th>
            </tr>
            {users.filter(userFilter).map((user: User) => (
              <tr onClick={() => handleClick(user)} 
                  className={`hover:cursor-pointer hover:bg-base-300 ${isUserSelected(user) ? "bg-base-200": ""}`} key={user.id}>
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

      <div className='w-full p-5 flex flex-col gap-5'>
        <textarea className='textarea textarea-primary w-full' placeholder='Message...' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className='btn' onClick={handleSend}>Send!</button>
      </div>
    </div>
    </div>
  )
}

export default Message
