import React from 'react'

const Loading = (props) => {
  return (
    <div className="row" id="message">
      <img className='loader' src='/loader.svg' />
      {props.msg}
    </div>
  )
}

export default Loading
