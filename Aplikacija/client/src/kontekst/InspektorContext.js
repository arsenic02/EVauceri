import {createContext, useReducer} from 'react'

export const InspektorContext = createContext()

export const inspektorReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
             return { user: action.payload };
        case 'LOGIN-INSPEKTOR':
                return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        case 'SET_GOST':
            return { ...state, gost: action.payload };
        case 'UPDATE_GOST':
            return { ...state, gost: { ...state.gost, ...action.payload } };
        case 'CLEAR_GOST':
            return { ...state, gost: null };
        default:
            return state;
    }
};

export const InspektorContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(inspektorReducer, { gost: null });
    return (
        <InspektorContext.Provider value={{ ...state, dispatch }}>
            {children}
        </InspektorContext.Provider>
    );
};

