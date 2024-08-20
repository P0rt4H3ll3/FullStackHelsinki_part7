import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onReset = () => {
    setValue('')
  }

  return {
    // Flat object
    type,
    value,
    onChange,
    onReset
  }
}

// export const useField = (type) => {
//   const [value, setValue] = useState('')

//   const onChange = (event) => {
//     setValue(event.target.value)
//   }

//   const onReset = () => {
//     setValue('')
//   }

//   return {
//     input: {
//       //Grouping Fields Under an input Object
//       type,
//       value,
//       onChange
//     },
//     onReset
//   }
// }
//const content = useField('text')
//const content = content.input.value
//content.onReset()
