import { Route, Routes } from 'react-router-dom'
import './App.css'
import Registraion from './Pages/Registraion/Registraion'
import Login from './Pages/Login/Login'
import firebaseConfig from './firebase.config'
// import app from './firebase.config'
import Home from './Pages/Home/Home'
import { ToastContainer } from 'react-toastify'
import ForgetPassword from './Pages/forgetpassword/ForgetPassword'
import Chat from './Pages/chat/Chat'

function App() {
  

  return (
   <div>
    <ToastContainer position="top-center" />
   
   <Routes>
    <Route path='/' element = {<Registraion></Registraion>}  />
    <Route path='/Login' element = { <Login></Login> }/>
    <Route path='/Home' element = { <Home></Home> }/>
    <Route path='/forgetPassword' element = { <ForgetPassword></ForgetPassword> }/>
    <Route path='/chat' element={ <Chat></Chat> }/>
   </Routes>
   
   
   
   </div>
  )
}

export default App
