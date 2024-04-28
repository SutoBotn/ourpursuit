import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const SignupForm = ({ updateToken }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    error: ''
  });

  const handleChange = (e) => {
    setFormData((prevFormData) => ({ 
      ...prevFormData, 
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/signup/', formData);
      if (response.data.isAuthenticated) {
        const { refresh, access } = response.data;
        sessionStorage.setItem('refresh', refresh);
        sessionStorage.setItem('access', access);
        updateToken(access);
      }
    } catch (error) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        password: '',
        error: error.response.data.error
      }));
    }
  };

  return (
    <div className="selection:bg-orange selection:text-cream">
      <div className="flex justify-center items-center">
        <div className="p-8 flex-1">
          <div className="mx-auto overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl text-center md:text-4xl font-bold text-brown">
                Create account
              </h1>

              <form className="mt-4 md:mt-6" onSubmit={handleSubmit}>
                <div className="relative">
                  <label htmlFor="email" className={`block text-brown font-bold mb-2 ${formData.error && formData.error.includes('Email') && 'text-error'}`}>Email Address</label>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard ${formData.error && formData.error.includes('Email') && 'border-error'}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {formData.error && formData.error.includes('Email') && (
                    <div className="absolute right-3 top-2 text-error">
                      <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/>
                    </div>
                  )}
                </div>
                {formData.error && formData.error.includes('Email') && (
                  <div className="mt-1 text-error text-sm">{formData.error}</div>
                )}
                <div className="mt-2 relative">
                  <label htmlFor="username" className={`block text-brown font-bold mb-2 ${formData.error && formData.error.includes('Username') && 'text-error'}`}>Username</label>
                  <input
                    name="username"
                    id="username"
                    type="text"
                    className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard ${formData.error && formData.error.includes('Username') && 'border-error'}`}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {formData.error && formData.error.includes('Username') && (
                    <div className="absolute right-3 top-2 text-error">
                      <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/>
                    </div>
                  )}
                </div>
                {formData.error && formData.error.includes('Username') && (
                  <div className="mt-1 text-error text-sm">{formData.error}</div>
                )}
                <div className="mt-2 relative">
                  <label htmlFor="password" className={`block text-brown font-bold mb-2 ${formData.error && formData.error.includes('Password') && 'text-error'}`}>Password</label>
                  <input
                    name="password"
                    id="password"
                    type="password"
                    className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard ${formData.error && formData.error.includes('Password') && 'border-error'}`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {formData.error && formData.error.includes('Password') && (
                    <div className="absolute right-3 top-2 text-error">
                      <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/>
                    </div>
                  )}
                </div>
                {formData.error && formData.error.includes('Password') && (
                  <div className="mt-1 text-error text-sm">{formData.error}</div>
                )}
                <button
                  type="submit"
                  className="mt-6 px-8 py-3 uppercase rounded-full bg-orange text-cream font-bold text-center block w-full focus:outline-none cursor-pointer"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
