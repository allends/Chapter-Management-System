'use client'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import prisma from '../../lib/prisma'

const getUsers = async () => {
  const response = await fetch('/api/users', {
    method: 'GET'
  })
  const users = await response.json()
  return users
}

const BrothersPage = () => {

  const session = useSession()
  const [users, setUsers] = useState<User[]>([])
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

  return (
    <div>
      <div className='text-3xl text-center p-5'>
        Brother Contact
      </div>
      <table className='table mx-auto'>
        <tbody>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
        {users.map((user: any) => (
          <tr key={user.id}>
            <td>
              <div className='avatar'>
                <div className='w-10 rounded-full'>
                  <img src={user.image} />
                </div>
              </div>
            </td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.status}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}
export default BrothersPage
