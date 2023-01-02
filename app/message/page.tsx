'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { getUsers } from '../brothers/page'

const Message = () => {

  const session = useSession()
  const [users, setUsers] = useState<any>([])
  const [message, setMessage] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<any>([])
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
    console.log(selectedUsers)
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([
        user,
        ...selectedUsers
      ])
    } else {
      setSelectedUsers(selectedUsers.filter((u: any) => u.id !== user.id))
    }
  }

  const handleSend = () => {

    selectedUsers.forEach((user: any) => {
      // mappings for current semesters points

      const mapObj: any = {
        '{name}': user.name,
      };

      let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      const str = message.replace(re, function (matched) {
        return mapObj[matched];
      });

      // TODO send the messages with twilio api
      console.log(str)
    })
  }

  const isUserSelected = (user: any) => {
    console.log(selectedUsers.find((selectedUser: any) => user.id === selectedUser.id) !== undefined)
    return selectedUsers.find((selectedUser: any) => user.id === selectedUser.id) !== undefined
  }

  return (
    <div className='flex flex-row h-full'>
      <div className='bg-base-100 h-full'>
        <table className='table'>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Status</th>
            </tr>
            {users.map((user: any) => (
              <tr onClick={() => handleClick(user)} 
                  className={`hover:cursor-pointer hover:bg-base-300 ${isUserSelected(user) ? "bg-base-200": ""}`} key={user.id}>
                <td>
                  <div className='avatar'>
                    <div className='w-10 rounded-full'>
                      <img src={user.image} />
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

  )
}

export default Message
