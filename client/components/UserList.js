import React from 'react'
import {Link} from 'react-router'

const UserList = (props) => {
  return (
    <div className='row'>
      <span className='cafe-name'>{props.data}</span>
    </div>
  )
}

export default UserList
