import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
function Profile() {
  const loggedInUser = useSelector(store => store.user)
  const navigate = useNavigate()
  return (
    <div>
      <h1>{loggedInUser.firstName}</h1>
      <button className="btn btn-secondary" onClick={()=>{navigate('/login')}}>
        Back to Login
      </button>
    </div>
  )
}

export default Profile
