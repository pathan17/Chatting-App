
import Lottie from "lottie-react";
import loginAnimation from '../../../public/image/login.json'
import { useState } from "react";
import { Button_v_1 } from "../../Components/Button";
import { IoMdEyeOff,IoMdEye } from "react-icons/io";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate,} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Bars } from 'react-loader-spinner'
import { useDispatch } from "react-redux";
import { userLogInfo } from "../../Slices/userSlice";


const Login = () => {
      const dispatch = useDispatch()
      const auth = getAuth();

      const Navigate = useNavigate()

    // input information field start
  
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
  
    // input information field end

    // input error information field start
    
    const [emailError , setEmailError] = useState('')
    const [passwordError , setPasswordError] = useState('')
   
    // input error information field end
    // showPassword , ReShowPassword start
    const [showPassword , setShowPassword] = useState(false)
    const handleShowPassword=()=>{
        setShowPassword(!showPassword)

    }
   
    // showPassword , ReShowPassword end

    // loder spinner information start
    const [loder , setLoder] = useState(false)
    // loder spinner information end

    // input onchange information name, email, password, rePassword field start

  
    const handleEmail =(e)=>{
        setEmail(e.target.value)
        setEmailError('')
    }
    const handlePassword =(e)=>{
        setPassword(e.target.value)
        setPasswordError('')
    }
  
    // input onchange information name, email, password, rePassword field end

    // Regex name and email start information
   
    const emailRegex =/^\S+@\S+\.\S+$/;

    // Regex name and email end information 
    
    // input handleClick information start
    const handleSubmit=(e)=>{
        e.preventDefault()
        
        
         if(!email){
            setEmailError("email is requred")
        }
        else if(!emailRegex.test(email)){
            setEmailError("email is not valid")
        }
        else if(!password){
            setPasswordError("password is requred")
        }
      
       
        else if ( email && emailRegex.test(email) && password ){
            setLoder(true)
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                setLoder(false)
                toast.success("successfull")
                dispatch(userLogInfo(user))
                localStorage.setItem("user", JSON.stringify(user))
                Navigate("/Home")
             
            })
            .catch((error) => {
                setLoder(false)
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode)
              console.log(errorMessage)
              if(errorCode==="auth/invalid-credential"){
                setPasswordError('worng password')
                toast.error('worng password')
              }
              
          
              
            });
            
        } 
        
    }
    // input handleClick information end




    return (
        <div>
        
            <div className="registration bg-gray-200 h-screen">
                <div className="container mx-auto">
                    <div className="main flex justify-between flex-wrap items-center">
                        <div className="inputs w-[40%]">


                            
                            <div className="main_inputs">
                                <form onSubmit={handleSubmit} className="from_input" >
                                    <h1>log_in</h1>
                                  
                                   
                                    <input onChange={handleEmail} value={email} type="text" placeholder="email"/>
                                    <p className="errorMess"> {emailError} </p>
                                    <div className="eye">
                                    <input onChange={handlePassword} value={password} type={showPassword? "text" : "password"} placeholder="password"/>
                                    {
                                        showPassword ?
                                        <IoMdEye onClick={handleShowPassword} className="eyeOff" />
                                        :
                                        <IoMdEyeOff onClick={handleShowPassword} className="eyeOff" />
                                    }
                                    </div>
                                    <p className="errorMess"> {passwordError} </p>
                                    
                                    
                                    {
                                        loder?
                                        <div className=" flex justify-center">

                                            <Bars></Bars>
                                        </div>
                                        :
                                    
                                         <Button_v_1 >Login</Button_v_1>
                                         
                                    }
                                    <div className="flex justify-between items-center">
                                    <p className="text-left mt-4 text-sm font-bold text-green-900">new heare? please 
                                     <Link className=" text-red-700 font-bold capitalize" to='/'>Registraion</Link>
                                    </p>
                                     <Link className=" text-red-700 font-bold capitalize" to='/forgetPassword'>forgetPassword</Link>
                                   
                                    </div>
                                </form>
                            </div>




                        </div>

                        <div className="lottie img w-[50%]">
                               <h1>welcome to connect app</h1>
                                 <div>
                                   <Lottie className="w-full" animationData={loginAnimation}/>
                                 </div>
                          </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;