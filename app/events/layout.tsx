import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex flex-row justify-center items-center">
          <div className="text-center font-semibold text-3xl m-5">Events</div>
        </div>
      </div>
    {children} 
    </div>
  )
}

export default RootLayout