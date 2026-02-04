import {createContext, useReducer} from 'react'

export const StanodavacContext = createContext()

export const StanodavacReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
             return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        case 'SET_STANODAVAC':
            return { ...state, selectedStanodavac: action.payload };
        case 'UPDATE_STANODAVAC':
            return { ...state, stanodavac: { ...state.stanodavac, ...action.payload } };
        case 'CLEAR_STANODAVAC':
            return { ...state, selectedStanodavac: null };
        default:
            return state;
    }
};

export const StanodavacContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(StanodavacReducer, { selectedStanodavac: null }); //stanodavac
    return (
        <StanodavacContext.Provider value={{ ...state, dispatch }}>
            {children}
        </StanodavacContext.Provider>
    );
};

