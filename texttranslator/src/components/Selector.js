import React, {useState} from 'react'

const Selector = (props) => {
  return (
    <select onChange={e => props.setValue(e.target.value)}>
        {props.options.map((opt, index) => <option key={index} value={opt.code}>{opt.name}</option >)}
    </select>
  )
}

export default Selector