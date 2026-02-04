import {createContext, useReducer, useEffect} from 'react'

export const SmestajContext = createContext()

export const smestajReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
             return { user: action.payload };
        case 'LOGIN-GOST':
             return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        case 'SET_GOST':
            return { ...state, selectedSmestaj: action.payload };
        case 'UPDATE_GOST':
            return { ...state, smestaj: { ...state.smestaj, ...action.payload } };
        case 'CLEAR_GOST':
            return { ...state, selectedSmestaj: null };
        default:
            return state;
    }
};

export const SmestajContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(smestajReducer, { selectedSmestaj: null });
    return (
        <SmestajContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SmestajContext.Provider>
    );
};

