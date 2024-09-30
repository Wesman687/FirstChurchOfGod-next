import React from 'react'
import { RingLoader } from 'react-spinners'

function RingSpinner() {
  return (
    <div className="settings-ring-container"><RingLoader color={'#1DC6DF'}  speedMultiplier={2}/></div>

    
  )
}

export default RingSpinner