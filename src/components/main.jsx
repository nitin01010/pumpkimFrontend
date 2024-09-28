import React, { useState } from 'react';
import Logo from '../../public/Logo.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const [input, setInput] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update input value
        setInput(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear error message on input change
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };
    const navigator = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;

        // Reset errors
        setErrors({ email: '', password: '' });

        // Basic validation
        if (!input.email) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Email is required.' }));
            hasError = true;
        }
        if (!input.password) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required.' }));
            hasError = true;
        }

        const postdata = async () => {
            try {
                const response = await axios.post("https://backendpumpkim.onrender.com/api/v1/users/login", {
                    email: input.email,
                    password: input.password,
                });
                console.log(response.data); // Log the response data
                toast.success("Login successful!"); // Success notification
                localStorage.setItem("user", true)
                navigator("/dashboard")
            } catch (error) {
                console.error("Error posting data:", error); // Handle errors
                toast.error("Login failed. Please check your credentials."); // Error notification
            }
        };

        if (!hasError) {
            console.log('Email:', input.email);
            console.log('Password:', input.password);
            postdata(); // Call the postdata function if no error
        }
    };

    return (
        <div className='Main flex justify-center p-2 items-center h-[100vh]'>
            <div className='bg-white flex flex-col justify-center items-center rounded-[16px] w-[459px] md:w-[659px] h-[578px]'>
                <img src={ Logo } className='object-cover w-[126px] h-[58px]' alt="" />
                <form className='p-3 flex flex-col gap-2' onSubmit={ handleSubmit }>
                    <p>Email</p>
                    <input
                        type="text"
                        name="email"
                        className='border bg-[#F7FBFF] rounded-[8px] py-2 h-[50px] px-3 outline-[#D4D7E3] border-[#D4D7E3] w-[320px] md:w-[388px]'
                        placeholder='Example@email.com'
                        value={ input.email }
                        onChange={ handleChange }
                    />
                    { errors.email && <p className='text-red-500 text-sm'>{ errors.email }</p> } {/* Error message for email */ }

                    <p>Password</p>
                    <input
                        type="password"
                        name="password"
                        className='border bg-[#F7FBFF] rounded-[8px] py-2 h-[50px] px-3 outline-[#D4D7E3] border-[#D4D7E3] w-[320px] md:w-[388px]'
                        placeholder='At least 8 characters'
                        value={ input.password }
                        onChange={ handleChange }
                    />
                    { errors.password && <p className='text-red-500 text-sm'>{ errors.password }</p> } {/* Error message for password */ }

                    <button
                        type="submit"
                        className='bg-[#162D3A] w-[320px] md:w-[388px] h-[52px] rounded-[8px] text-lg text-white mt-4'
                    >
                        Sign in
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Main;
