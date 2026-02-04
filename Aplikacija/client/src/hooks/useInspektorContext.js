import { InspektorContext } from "../kontekst/InspektorContext";
import { useContext } from "react";

export const useInspektorContext = () => {
    const context = useContext(InspektorContext)

    if(!context) {
        throw Error('useInspektorContext must be used inside an InspektorContextProvider')
    }
    return context
}