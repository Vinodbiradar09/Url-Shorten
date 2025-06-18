import React from 'react'
import { registerUser } from "../api/user.api";
import { useState } from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import { login } from '../store/slice/slice';


const RegisterForm = ({ state }) => {
  const [name, setName] = useState('');
  const [email, SetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state)=> state.auth);
  console.log(auth);
  

  const handleFileChange = (e) =>{
    const file = e.target.files[0];

    if(!file){
      setError("file not available")
    }
    setAvatar(file);
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await registerUser(name, email, password, avatar);
      setLoading(false);
      dispatch(login(data));
      navigate({to : "/dashboard"});
      setLoading(false);
      console.log("registered user", data);
      

    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to register the user");
    }

  }


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id='name'
            required
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id='email'
            required
            placeholder='Email'
            value={email}
            onChange={(e) => SetEmail(e.target.value)}
          />

        </div>

        <div className='mb-4'>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id='password'
            placeholder='*******'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div >

        <div className='mb-4'>
          <label 
            className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="avatar">Avatar</label>
          <input 
           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="file" 
          id='avatar'
          accept='image/*'
          onChange={handleFileChange}
          required
          
          />
          {avatar && (
           <p className="text-sm text-gray-600 mt-1">
              Selected: {avatar.name}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>


        <div className="text-center mt-4">
          <p className="cursor-pointer text-sm text-gray-600">
            Already have an account? <span onClick={() => state(true)} className="text-blue-500 hover:text-blue-700">
              Sign In
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}

export default RegisterForm
