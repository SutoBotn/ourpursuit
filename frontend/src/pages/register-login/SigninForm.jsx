import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const SigninForm = ({ updateToken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    error: false
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
      const response = await axios.post('http://localhost:8000/api/login/', formData);
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
        error: error
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
                Welcome back!
              </h1>

              <form className="mt-4 md:mt-7" onSubmit={handleSubmit}>
                <div className="max-w-md mx-auto relative">
                  <label htmlFor="username" className={`block text-brown font-bold mb-2 ${formData.error && 'text-error'}`}>Username</label>
                  <input
                    name="username"
                    id="usernameInput"
                    type="text"
                    className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard ${formData.error && 'border-error'}`}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {formData.error && ( // Show error icon and message if present
                    <div className="absolute right-3 top-2">
                      <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/>
                    </div>
                  )}
                </div>
                <div className="mt-5 relative">
                  <label htmlFor="password" className={`block text-brown font-bold mb-2 ${formData.error && 'text-error'}`}>Password</label>
                  <input
                    name="password"
                    id="passwordInput"
                    type="password"
                    className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard ${formData.error && 'border-error'}`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {formData.error && ( // Show error icon if present
                    <div className="absolute right-3 top-2">
                      <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C' />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-error text-center font-bold text-sm">
                  {formData.error && 'Invalid username or password'}
                </div>

                <button
                  type="submit"
                  className="mt-6 first-letter:md:mt-8 px-8 py-3 uppercase rounded-full bg-orange text-cream font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 cursor-pointer"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
