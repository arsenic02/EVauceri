import {createContext, useReducer, useEffect} from 'react'

export const GostContext = createContext()

export const gostReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
             return { user: action.payload };
        case 'LOGIN-GOST':
             return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        case 'SET_GOST':
            return { ...state, selectedGost: action.payload };//gost
        case 'UPDATE_GOST':
            return { ...state, gost: { ...state.gost, ...action.payload } };
        case 'CLEAR_GOST':
            return { ...state, selectedGost: null };
        default:
            return state;
    }
};

export const GostContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gostReducer, { selectedGost: null });//gost
    return (
        <GostContext.Provider value={{ ...state, dispatch }}>
            {children}
        </GostContext.Provider>
    );
};

