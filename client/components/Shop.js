import React from 'react'
import {Link} from 'react-router'

const Shop = (props) => {
  return (
    <div className="row" id={props.data.place_id}>
      <span className='cafe-name'><Link to={'/details/'+props.index}>{props.data.name}</Link></span>
      <span className='cafe-address'>{props.data.vicinity}</span>
      <span className='cafe-rating'>{props.data.rating}</span>
    </div>
  )
}

export default Shop
