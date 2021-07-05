import React, { useState, useImperativeHandle } from 'react'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  function toggleVisibility() {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return(
    <div>
      {visible
        ? <div>
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
        : <button onClick={toggleVisibility}>{props.toggleType}</button>}
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable