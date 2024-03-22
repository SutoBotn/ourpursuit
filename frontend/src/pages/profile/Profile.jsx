import React from 'react';
import Layout from '../../components/layout';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className='w-5/6'>
        <h3 className='italic text-center'>MY PROFILE</h3>
        <div className='flex flex-col lg:flex-row gap-10 justify-around py-6'>
          <div 
            onClick={() => navigate('/account/user-details')}
            className='flex-1 bg-mustard mb-4 lg:mb-0 lg:px-4 py-24 rounded-lg text-center cursor-pointer'
          >
            <h3>A C C O U N T<br />D E T A I L S</h3>
            <p>View Details</p>
            <p>Change Details</p>
            <p>Logout</p>
          </div>
          <div 
            onClick={() => navigate('/account/uploads')}
            className='flex-1 bg-mustard mb-4 lg:mb-0 lg:px-4 py-24 rounded-lg text-center cursor-pointer'
          >
            <h3>U P L O A D S</h3>
            <p>View your Advice</p>
            <p>View your Questions</p>
            <p>Manage your Posts</p>
          </div>
          <div
            onClick={() => navigate('/account/saved-posts')}
            className='flex-1 bg-mustard mb-4 lg:mb-0 lg:px-4 py-24 rounded-lg text-center cursor-pointer'
            >
            <h3>S A V E D</h3>
            <p>Revisit Liked Posts</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
