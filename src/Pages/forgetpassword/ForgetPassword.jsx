import { useState } from "react";
import { Button_v_1 } from "../../Components/Button";
import{Link} from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";


const ForgetPassword = () => {
    const auth = getAuth();

    const [email , setEmail] =useState("")
    const [emailError , setEmailError] = useState("")


   const handleChange =(e)=>{
    setEmail(e.target.value) 
    setEmailError('')

   }
   const handleSubmit =(e)=>{
    e.preventDefault()
    if(!email){
        setEmailError('email is requerd')
    }
    else{
        sendPasswordResetEmail(auth, email)
        .then(() => {
        toast.success('email sent')
        })
        .catch((error) => {
          console.log(error.message)
          if(error.message=== "Firebase: Error (auth/invalid-email)"){
            setEmailError("user not found")
            toast.error('user not found')
          }
        });

    }

   }


    return (
        <div className=" forgetPassword h-screen bg-green-900 flex justify-center items-center">
            
                <div className="w-[400px] p-5 rounded-lg bg-slate-300 text-red-400">
                <form onSubmit={handleSubmit}>
                    <h1 className=" uppercase text-black ">forgetPassword</h1>
                    <input onChange={handleChange} type="text" />
                    <p className="errorMess mb-5"> {emailError} </p>
                    <div className=" flex gap-10">
                        <Button_v_1>send</Button_v_1>
                        <Button_v_1>
                            <Link to='/Login'> back to Login </Link>
                        </Button_v_1>
                    </div>
                </form>
                   
                    
                </div>
 
        </div>
    );
};

export default ForgetPassword;