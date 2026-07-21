import {BrowserRouter,Routes,Route} from 'react-router'
import Main from './components/Main'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
function App() {

  return (
    <>
      <BrowserRouter basename='/app'>
        <Routes>
            <Route path='/' element={<Main/>}>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<SignUp/>}/>
              <Route path='/profile' element={<Profile/>}/>
            </Route>
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
