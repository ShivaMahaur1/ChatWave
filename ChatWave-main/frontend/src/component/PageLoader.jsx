
import React from 'react'
import {PuffLoader} from 'react-spinners'
const PageLoader = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <PuffLoader color='#00ffff' className='animate-spin size-10'/>
    </div>
  )
}

export default PageLoader