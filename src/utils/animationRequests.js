import axios from "axios"

const api = axios.create({
    baseURL: '/api',
})

const authHeader = () => {
    const tokenStorage = JSON.parse(localStorage.getItem('okta-token-storage'))
    const { accessToken } = tokenStorage.accessToken
    return { Authorization: `Bearer ${accessToken}` }
}

export const getAnimation = id => api.get(`/animations/${id}`, { headers: authHeader() })
export const deleteAnimation = id => api.delete(`animations/${id}`, { headers: authHeader() })
export const putAnimation = (id, animation) => api.put(`animations/${id}`, animation, { headers: authHeader() })
export const postAnimation = animation => api.post('animations', animation, { headers: authHeader() })
export const getAnimationList = () => api.get('/animations', { headers: authHeader() })
