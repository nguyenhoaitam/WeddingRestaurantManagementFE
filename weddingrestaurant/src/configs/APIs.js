import axios from "axios";

const BASE_URL = 'http://192.168.1.17:8000/'

export const endpoints = {
    'login': '/o/token/',
    'current_user': '/users/current_user/',
}


export const authApi = (accessToken) => axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    }
})

export default axios.create({
    baseURL: BASE_URL
})