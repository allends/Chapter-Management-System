'use client'
import { Category, Semester, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {FieldValues, useForm, UseFormRegister, UseFormSetValue} from 'react-hook-form'
import { genOptionsObj } from '../../../utils/objects'


export const SelectOptions = ({ options, name, register }: { options: any[], name: string, register: UseFormRegister<FieldValues>}) => {
  return <select {...register(name)} className="select select-bordered w-full max-w-xs">
        <option disabled>{name}</option>
        {options.map(opt => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>
}

const UserPicker = ({ users, setValue }: {users: User[], setValue: UseFormSetValue<FieldValues>}) => {
  const [query, setQuery] = useState<string>("")
  const [selectedUserId, setSelectedUserId] = useState<string[]>([])

  const isUserSelected = (userId: string) => {
    return selectedUserId.includes(userId)
  }

  const handleClick = (userId: string) => {
    if (isUserSelected(userId)) setSelectedUserId(selectedUserId.filter(id => userId !== id))
    else (setSelectedUserId([...selectedUserId, userId]))
  }

  useEffect(() => {
    setValue("userIds", selectedUserId)
  }, [selectedUserId])

  return (
      <div className="w-80">
        <input placeholder="Search Attendees" type="text" className="input input-bordered w-full max-w-xs" value={query} onChange={e => setQuery(e.target.value)} />
        {users?.filter((user: User) => query.length === 0 ||  user.name?.toLowerCase().includes(query.toLowerCase())).map((user: User) => (
          <div onClick={() => handleClick(user.id)}
            className={`flex flex-row items-center justify-between p-2 w-80 hover:cursor-pointer hover:bg-base-300 ${isUserSelected(user.id) ? "bg-base-200" : ""}`} key={user.id}>
            <td>
              <div className='avatar'>
                <div className='w-10 rounded-full'>
                  <img src={user.image ?? ""} />
                </div>
              </div>
            </td>
            <td className={``}>{user.name}</td>
            <td>{user.status}</td>
          </div>
        ))}
      </div>)
}

export const EventForm = ({ users }: { users: User[]}) => {

  const { register, handleSubmit, getValues, setValue } = useForm()
  const eventOptions = Object.keys(Category).map(genOptionsObj)
  const valueOptions = [0, 1, 2, 3, 4, 5].map(genOptionsObj)
  const semesterOptions = Object.keys(Semester).map(genOptionsObj)
  const router = useRouter()

  if (!users) {
    return <div>error</div>
  }

  const createEvent = async (data: any) => {
    const resp = await fetch('/api/create-event', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    router.refresh()
    const json = resp.json()
    return json
  }

  const onSubmit = async () => {
    const formData = getValues()
    createEvent(formData)
  }

  return (
    <div className='flex flex-row justify-center gap-5'>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-3">
        <input type="text" placeholder="Event Name" {...register("title")} className="input input-bordered w-full max-w-xs" />
        <input type="date" placeholder="Date" {...register("date")} className="input input-bordered w-full max-w-xs" />
        <SelectOptions options={eventOptions} name="category" register={register} />
        <SelectOptions options={valueOptions} name="value" register={register} />
        <SelectOptions options={semesterOptions} name="semester" register={register} />
        <input type="submit" className="btn" />
      </form>
      <UserPicker users={users} setValue={setValue} />
    </div>
  )
}
