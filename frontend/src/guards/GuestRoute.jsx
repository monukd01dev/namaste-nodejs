import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const GuestRoute = function({children}){
    const user = useSelector(store => store.user);
    console.log(`Log from GuestRoue` ,user)
    if(user){
        return <Navigate to='/profile' replace/>
    }

    return children
}

export default GuestRoute;