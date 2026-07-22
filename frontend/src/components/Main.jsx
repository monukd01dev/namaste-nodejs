import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router'
function Main() {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className="grow  flex items-center justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Main
