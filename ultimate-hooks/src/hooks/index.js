import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onReset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    onReset
  }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const getAll = async () => {
      const response = await axios.get(baseUrl)
      setResources(response.data)
    }
    getAll()
  }, [baseUrl])

  const create = async (newResource) => {
    const response = await axios.post(baseUrl, newResource)
    return setResources(resources.concat(response.data))
  }

  const service = {
    create
  }

  return [resources, service]
}
