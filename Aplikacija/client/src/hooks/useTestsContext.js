import { TestsContext } from "../kontekst/TestContext";
import { useContext } from "react";

export const useTestsContext = () => {
    const context = useContext(TestsContext)

    if(!context) {
        throw Error('useTestsContext must be used inside an TestContextProvider')
    }
    return context
}