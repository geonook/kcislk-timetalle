import { useState, useEffect } from 'react'
import axios from 'axios'

const useApi = (url, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(url)
        setData(response.data)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, ...dependencies])

  return { data, loading, error, refetch: () => {
    if (url) {
      setLoading(true)
      setError(null)
      axios.get(url)
        .then(response => setData(response.data))
        .catch(err => setError(err.response?.data?.error || err.message))
        .finally(() => setLoading(false))
    }
  }}
}

export default useApi