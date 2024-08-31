import React, { createContext, useReducer, useEffect } from "react";
import { authApi, endpoints } from "./APIs";

const initialState = {
    user: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "login":
            return { ...state, user: action.payload };
        case "logout":
            return { ...state, user: null };
        default:
            return state;
    }
};

export const MyUserContext = createContext();
export const MyDispatchContext = createContext();

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const userResponse = await authApi(token).get(endpoints['current_user']);
                    console.group(userResponse)
                    dispatch({ type: "login", payload: userResponse.data });
                } catch (error) {
                    console.error("Lỗi khi nạp người dùng:", error);
                }
            }
        };
        checkLoginStatus();
    }, []);

    return (
        <MyUserContext.Provider value={state.user}>
            <MyDispatchContext.Provider value={dispatch}>
                {children}
            </MyDispatchContext.Provider>
        </MyUserContext.Provider>
    );
};