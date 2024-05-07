import Lottie from "lottie-react";
import Animation from "../../../public/image/6.json";
import { useState } from "react";
import { Button_v_1 } from "../../Components/Button";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Bars } from 'react-loader-spinner'
import { getDatabase, ref, set } from "firebase/database";


const Registraion = () => {

    const auth = getAuth();
    const Navigate = useNavigate()
    const db = getDatabase();

    // input information field start
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    // input information field end

    // input error information field start
    const [fullNameError, setFullNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [rePasswordError, setRePasswordError] = useState('')
    // input error information field end
    // showPassword , ReShowPassword start
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)
    const handleShowPassword = () => {
        setShowPassword(!showPassword)

    }
    const handleShowRePassword = () => {
        setShowRePassword(!showRePassword)
    }
    // showPassword , ReShowPassword end

    // loder spinner information start
    const [loder, setLoder] = useState(false)
    // loder spinner information end

    // input onchange information name, email, password, rePassword field start

    const handleName = (e) => {
        setFullName(e.target.value)
        setFullNameError('')
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
        setEmailError('')
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
        setPasswordError('')
    }
    const handleRePassword = (e) => {
        setRePassword(e.target.value)
        setRePasswordError('')
    }
    // input onchange information name, email, password, rePassword field end

    // Regex name and email start information
    const nameRegex = /^[a-zA-Z '.-]*$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    // Regex name and email end information 

    // input handleClick information start
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!fullName) {
            setFullNameError('name is requred')
        }
        else if (!nameRegex.test(fullName)) {
            setFullNameError("name is not valid")
        }
        else if (!email) {
            setEmailError("email is requred")
        }
        else if (!emailRegex.test(email)) {
            setEmailError("email is not valid")
        }
        else if (!password) {
            setPasswordError("password is requred")
        }
        else if (!rePassword) {
            setRePasswordError("rePassword is requred")
        }
        else if (rePassword !== password) {
            setRePasswordError("password not match")
        }
        else if (fullName && nameRegex.test(fullName) && email && emailRegex.test(email) && password === rePassword) {
            setLoder(true)
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {

                    updateProfile(auth.currentUser, {
                        displayName: fullName,
                        photoURL: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }).then(() => {
                        const user = userCredential.user;
                        console.log(user)
                        toast.success("registration successfull")
                        Navigate("/Login")
                        setLoder(false)
                    })
                    .then(()=>{
                        set(ref(db, "users/" + auth.currentUser.uid ), {
                            username:fullName,
                            email: email,
                          });
                    })
                    .catch((error) => {
                        console.log(error)
                    });

                })
                .catch((error) => {
                    
                    const errorMessage = error.message;
                    if (errorMessage.includes("auth/email-already-in-use")) {
                        setEmailError('email-already-in-use')
                        toast.error("email-already-in-use")

                    }
                    console.log(errorMessage)
                    setLoder(false)

                });

        }

    }
    // input handleClick information end




    return (
        <div>

            <div className="registration bg-gray-200 h-screen">
                <div className="container mx-auto">
                    <div className="main flex justify-between flex-wrap items-center">
                        <div className="lottie img w-[50%]">
                            <h1>welcome to connect app</h1>
                            <div>
                                <Lottie className="w-full" animationData={Animation} />
                            </div>
                        </div>


                        <div className="inputs w-[40%]">
                            <div className="main_inputs">
                                <form onSubmit={handleSubmit} className="from_input" >
                                    <h1>Registration</h1>
                                    <input onChange={handleName} type="text" placeholder="full name" />
                                    <p className="errorMess"> {fullNameError} </p>
                                    <input onChange={handleEmail} value={email} type="text" placeholder="email" />
                                    <p className="errorMess"> {emailError} </p>
                                    <div className="eye">
                                        <input onChange={handlePassword} value={password} type={showPassword ? "text" : "password"} placeholder="password" />
                                        {
                                            showPassword ?
                                                <IoMdEye onClick={handleShowPassword} className="eyeOff" />
                                                :
                                                <IoMdEyeOff onClick={handleShowPassword} className="eyeOff" />
                                        }
                                    </div>
                                    <p className="errorMess"> {passwordError} </p>
                                    <div className="eye">
                                        <input onChange={handleRePassword} value={rePassword} type={showRePassword ? "text" : "password"} placeholder="re-password" />
                                        {
                                            showRePassword ?
                                                <IoMdEye onClick={handleShowRePassword} className="eyeOff" />
                                                :
                                                <IoMdEyeOff onClick={handleShowRePassword} className="eyeOff" />
                                        }

                                    </div>
                                    <p className="errorMess">{rePasswordError}</p>
                                    {
                                        loder ?
                                            <div className=" flex justify-center">

                                                <Bars></Bars>
                                            </div>
                                            :
                                            <Button_v_1>submit</Button_v_1>
                                    }
                                    <p className="text-left mt-4 text-sm font-bold text-green-900">allready have an account? please  <Link className=" text-red-700 font-bold" to='/Login'>sign_in</Link> </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registraion;