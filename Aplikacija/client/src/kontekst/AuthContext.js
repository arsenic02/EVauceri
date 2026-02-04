import { createContext, useEffect, useReducer } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Define the initial state and reducer
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return { user: null ,smestaji: [], smestajneJedinice: [], zahtevi: [], vauceri: []};
        case 'SET_SMESTAJI':
                return { ...state, smestaji: action.payload };
        case 'ADD_SMESTAJ':
                return { ...state, smestaji: [...state.smestaji, action.payload] };
        case 'SET_SMESTAJ':
                return { ...state, smestaji: action.payload };
        case 'GET_SMESTAJ':
             
                if (state.smestaji) {
                    const smestajExists = state.smestaji.find(smestaj => smestaj.naziv === action.payload.naziv);
                    if (!smestajExists) {
                        return { ...state, smestaji: [...state.smestaji, action.payload] };
                    }
                } else {
                    return { ...state, smestaji: [action.payload] };
                }
                return state;

        case 'REFRESH':
                return {...state, smestaj: [...state.smestaj,action.payload]};
        
                case 'GET_SMESTAJNA_JEDINICA':
                    if (!state.smestajneJedinice) {
                        return { ...state, smestajneJedinice: [action.payload] };
                    }
                    return { ...state, smestajneJedinice: [...state.smestajneJedinice, action.payload] };

                    
        case 'SET_SMESTAJNE_JEDINICE':
            return { ...state, smestajneJedinice: action.payload };

                    case 'SET_ZAHTEVI':
                        return { ...state, zahtevi: action.payload };    
                    
                        case 'SET_VAUCERI':
                        return { ...state, vauceri: action.payload };    
                
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null, smestaji: [], smestajneJedinice:[], zahtevi: [] });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
