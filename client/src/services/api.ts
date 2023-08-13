import axios from 'axios'

// criação da conexão com a api
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL
})

export default api
