import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = function ({ children }) {
    //* subscribing to the userSlice
    const user = useSelector(store => store.user)
    console.log(`Log from ProtectedRoue` ,user)
    //* if user doesn't exits the throw the hacker back to the loginPage and delete the Navigation History
    if(!user){
        return <Navigate to='/login' replace/>
    }
    //? when everything is oky then returnt the children
    return children
}

export default ProtectedRoute
