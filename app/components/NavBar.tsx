'use client'
import { useSession } from 'next-auth/react'
import {UserSession} from '../../lib/types'
import Link from 'next/link'
import React from 'react'

export const NavBar = () => {

  const user = useSession()
  const data: UserSession = user.data as UserSession

  return (
    <div className="navbar-center">
      <Link className="btn btn-ghost" href='/'>Home</Link>
      <Link className="btn btn-ghost" href='/events'>Events</Link>
      {user.status === 'authenticated' &&
        <>
          <Link className="btn btn-ghost" href='/brothers'>Brothers</Link>
          {data?.role === 'EBOARD' &&
          <>
            <Link className="btn btn-ghost" href='/message'>Message</Link>
          </>
          }
        </>
      }
    </div>
  )
}
