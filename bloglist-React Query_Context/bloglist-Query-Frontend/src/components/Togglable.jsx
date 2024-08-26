import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button, Box } from '@mui/material'

const Togglable = forwardRef(({ buttonLable, children }, ref) => {
  Togglable.displayName = 'Togglable'
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const hideWhenVisibile = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <Box>
      <div style={hideWhenVisibile}>
        <Button
          color="primary"
          variant="contained"
          sx={{
            ':hover': { bgcolor: '#cbc86d' }
          }}
          onClick={toggleVisibility}
        >
          {buttonLable}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <Button
          color="primary"
          variant="contained"
          sx={{
            ':hover': { bgcolor: '#cbc86d' }
          }}
          onClick={toggleVisibility}
        >
          cancel
        </Button>
      </div>
    </Box>
  )
})

Togglable.propTypes = {
  buttonLable: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Togglable
