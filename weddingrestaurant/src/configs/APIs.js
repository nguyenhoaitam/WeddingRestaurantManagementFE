import axios from "axios";

const BASE_URL = 'http://192.168.1.12:8000/'

export const endpoints = {
    'login': '/o/token/',
    'current_user': '/users/current_user/',
    'wedding_halls': '/wedding_halls/',
    'wedding_hall_prices': '/wedding_hall_prices/',
    'drinks': '/drinks/',
    'food_types': '/food_types/',
    'foods': '/foods/',
    'services': '/services/',
    'event_types': '/event_types/',
    'zalo_pay': 'momo/payment/',
    'momo': 'zalopay/payment/',
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