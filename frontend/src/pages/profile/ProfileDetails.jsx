import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import ProfileImage from '../../assets/images/profile-image.png';
import Layout from '../../components/layout';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function ProfileDetails({ updateToken }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [file, setFile] = useState(null);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const newPasswordFieldRef = useRef(null);
  const [initialUsername, setInitialUsername] = useState('');
  const [initialProfileImage, setInitialProfileImage] = useState(ProfileImage);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const get_details = async () => {
      try {
        const token = sessionStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response) {
          setInitialUsername(response.data.username);
          if (response.data.profile_image){
            setInitialProfileImage(response.data.profile_image);
          }
        }
      } catch (error) {
        console.error('Request headers:', error);
      }
    };

    get_details();
  }, [username]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handlePasswordFocus = () => {
    setShowNewPasswordField(true);
  };

  const handlePasswordBlur = (event) => {
    if (event.relatedTarget !== newPasswordFieldRef.current) {
      setShowNewPasswordField(false);
      setNewPassword('');
    }
  };

  const isFormValid = ((username !== "" && username !== initialUsername) || (password !== "" && newPassword !== "") || !!file);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    if (username !== initialUsername) {
      formData.append('username', username);
    }
    if (password !== "" && newPassword !== "") {
      formData.append('currentPassword', password);
      formData.append('newPassword', newPassword);
    }
    if (file) {
      formData.append('profile_image', file);
    }

    try {
      const token = sessionStorage.getItem('access');
      const response = await axios.post('http://localhost:8000/api/update-profile/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.message) {
        console.log('Profile updated successfully');
        document.getElementById('successMessage').classList.remove('hidden');
        setTimeout(() => {
          document.getElementById('successMessage').classList.add('hidden');
        }, 2000);
        setUsername('')
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setPassword('')
      setNewPassword('')
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/logout/');
      if (response.data.logout) {
        sessionStorage.removeItem('access');
        sessionStorage.removeItem('refresh');
        updateToken(null);
        navigate('/login');
      }
    } catch (error) {
      console.error('Request headers:', error);
    }
  };

  return (
    <Layout>
      <div className='w-1/2 items-center justify-center'>
        <div className='flex flex-row items-center'>
          <button
            className="cursor-pointer flex items-center"
            onClick={() => navigate('/account/')}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
          </button>
          <h3 className='text-center flex-grow'>P R O F I L E &nbsp; D E T A I L S</h3>
        </div>

        <div className='flex justify-center md:flex-row md:gap-32 md:mb-0 md:items-center gap-10 mb-10 flex-col-reverse'>
          <form className="mt-4 md:mt-8" onSubmit={handleSubmit}>
            <div className="relative max-w-md mx-auto">
              <label htmlFor="username" className={`block text-brown font-bold mb-2 ${errorMessage && errorMessage.includes('Username') && 'text-error'}`}>Username</label>
              <input
                name="username"
                id="username"
                type="text"
                className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard ${errorMessage && errorMessage.includes('Username') ? 'border-error' : ''}`}
                value={username}
                placeholder={initialUsername}
                onChange={handleUsernameChange}
              />
              {errorMessage && errorMessage.includes('Username') && (
                <div className="absolute right-3 top-2">
                  <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/>
                </div>
              )}
            </div>
            {errorMessage && errorMessage.includes('Username') && (
              <div className="mt-1 text-error text-sm">{errorMessage}</div>
            )}
            <div className="mt-5 relative">
              <label htmlFor="password" className="block text-brown font-bold mb-2">Password</label>
              <input
                name="password"
                id="password"
                type='password'
                className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard ${errorMessage && errorMessage.includes('Password') ? 'border-error' : ''}`}
                value={password}
                placeholder='Current Password'
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
              />
              {errorMessage && errorMessage.includes('Password') && (
                <div className="absolute right-3 top-2">
                  <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/>
                </div>
              )}
              {errorMessage && errorMessage.includes('Password') && (
                <div className="mt-1 text-error text-sm">{errorMessage}</div>
              )}
              {showNewPasswordField && (
                <div>
                <div className="relative">
                  <input
                    ref={newPasswordFieldRef}
                    name="newPassword"
                    id="newPassword"
                    type="password"
                    className={`block w-full py-2 px-4 bg-transparent border-4 border-green text-green rounded-lg focus:outline-none focus:border-mustard mt-3 ${errorMessage && errorMessage.includes('New') ? 'border-error' : ''}`}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  {errorMessage && errorMessage.includes('New') && (
                    <div className="absolute right-3 top-2">
                      <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/>
                    </div>
                  )}
                </div>
                {errorMessage && errorMessage.includes('New') && (
                  <div className="mt-1 text-error text-sm">{errorMessage}</div>
                )}
                </div>
              )}
            </div>
            <div className="mt-5 relative">
              <label htmlFor='file-upload' className="block text-brown font-bold mb-2">Profile Image</label>
              <label htmlFor="file-upload" className="w-full bg-white rounded-lg border-4 border-green px-4 py-2 flex items-center justify-between cursor-pointer">
                <span className="text-green font-bold">{file ? "Image Selected" : "Choose Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className='flex justify-center mt-5'>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-8 py-3 uppercase rounded-full bg-orange text-cream font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 cursor-pointer ${isFormValid ? '' : 'opacity-50 pointer-events-none'}`}
              >
                Save
              </button>
            </div>
            <p id="successMessage" className="text-green font-bold text-lg mt-2 hidden">Profile updated successfully!</p>
          </form>
          <div className='flex flex-col gap-6'>
            <div className="w-48 h-48 rounded-full flex items-center self-center justify-center mt-6 md:mt-0">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Uploaded" className="w-full h-full rounded-full object-cover" />
              ) : (
                <img src={initialProfileImage} alt='Default Profile Icon' className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`px-8 py-3 uppercase rounded-full bg-orange text-cream font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 cursor-pointer`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProfileDetails;