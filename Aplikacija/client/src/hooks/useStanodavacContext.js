import { StanodavacContext } from "../kontekst/StanodavacContext";
import { useContext } from "react";

export const useStanodavacContext = () => {
    const context = useContext(StanodavacContext)
    //console.log(context)
    if(!context) {
        throw Error('useStanodavacContext must be used inside an StanodavacContextProvider')
    }
    return context
}