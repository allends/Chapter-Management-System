'use client'
import React, { useEffect, useState } from 'react'
import _, { startCase } from 'lodash'
import { useSession } from 'next-auth/react'
import { BrotherPoints, User } from '@prisma/client'

const getCurrentUser = async () => {
  const resp = await fetch('/api/user', {
    method: 'GET',
    cache: 'no-cache'
  })
  const json = resp.json()
  return json
}

export const getCurrentUserPoints = async () => {
  const resp = await fetch('/api/points', {
    method: 'GET',
    cache: 'no-cache',
  })
  const json = resp.json()
  return json
}

const updateCurrentUser = async (user: any) => {
  const resp = await fetch('/api/user', {
    method: 'PATCH',
    cache: 'no-cache',
    body: JSON.stringify(user)
  })
  const json = resp.json()
  return json
}

const HomePage = () => {

  const session = useSession()

  const [user, setUser] = useState<User>()
  const [points, setPoints] = useState<BrotherPoints[]>([])
  const [editingFields, setEditingFields] = useState<User>()
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      return
    }
    getCurrentUserPoints().then((response) => setPoints(response))

    getCurrentUser().then((user) => {
      setUser(user)
      setEditingFields(user)
    })
  }, [])

  if (session.status === 'unauthenticated') {
    return <div className='text-center'>Please sign in</div>
  }

  const editable = ['nickname', 'number', 'venmo']
  const hiddenFields = ['id', 'userId']


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof User) => {
    if (!editingFields) {return}
    let newUser: any = _.clone(editingFields)
    newUser[key] = e.target.value as any
    setEditingFields(newUser)
  }

  const handleEditChange = () => {
    if (isEditing) {
      // update the user
      updateCurrentUser(editingFields).then(() => {
        getCurrentUser().then((user) => {
          setUser(user)
          setEditingFields(user)
        })
      })
    }
    setIsEditing(!isEditing)

  }

  if (!user || !editingFields) {
    return <div className='text-center'>Please sign in</div>
  }

  return (
    <div>
      <div className='flex flex-row justify-center items-center gap-3 p-5'>
        <div className='avatar'>
          <div className='w-10 rounded-full'>
            <img src={user?.image ?? ""} />
          </div>
        </div>
        <div className="text-3xl font-semibold">
          {user.name}
        </div>
      </div>

      {points.length > 0 &&
        <div className="p-10">
          <div className="text-xl font-semibold text-center">Points</div>
          <table className='table w-full'>
            <tbody>
              <tr>
                {Object.keys(points[0]).filter((key) => !hiddenFields.includes(key)).map((key) => {
                  return <th>{startCase(key)}</th>
                })}
              </tr>
              {points.map((pointObj: any) => (
                <tr key={pointObj.id}>
                  {Object.keys(pointObj).filter((key) => !hiddenFields.includes(key)).map((field: any) => <td>{pointObj[field]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      <div className="flex flex-row items-center justify-center gap-5">
        <div className="text-xl font-semibold text-center">Personal Information</div>
        <button onClick={handleEditChange} className="btn btn-sm">{isEditing ? "Submit" : "Edit"}</button>
      </div>
      {user && (
        <div className='flex flex-col items-center p-10'>
          <table className='table w-full my-o mx-auto'>
            <tbody>
              {Object.keys(editingFields).map((key) => {

                const isEditableField = editable.includes(key)
                const fieldDisabled = !isEditing || !isEditableField

                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td><input disabled={fieldDisabled} value={editingFields[key as keyof User] as any ?? ""} onChange={(e) => handleChange(e, key as keyof User)} /></td>
                  </tr>)
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default HomePage
