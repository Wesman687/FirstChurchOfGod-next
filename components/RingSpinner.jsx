import React from 'react'
import { RingLoader } from 'react-spinners'

function RingSpinner({colorChange}) {
  return (
    <div className="settings-ring-container"><RingLoader color={colorChange || '#1DC6DF'}  speedMultiplier={2}/></div>

    
  )
}

export default RingSpinner