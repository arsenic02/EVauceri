import { GostContext } from "../kontekst/GostContext";
import { useContext } from "react";

export const useGostContext = () => {
    const context = useContext(GostContext) 

    if(!context) {
        throw Error('useGostContext must be used inside an GostContextProvider')
    }
    return context
}