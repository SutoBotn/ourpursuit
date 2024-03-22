import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Layout from '../../components/layout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faBookmark, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserUploads = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const token = sessionStorage.getItem('access');


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user-posts/`, {
          headers: {
            'Authorization':  `Bearer ${token}`
          }
        })
        setPosts(response.data)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
  }, [token]);

  const handleDelete = async (postId) => {
    const response = await axios.get(`http://localhost:8000/api/delete-post/${postId}/`,{
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    if (response) {
        try {
          const response = await axios.get(`http://localhost:8000/api/user-posts/`, {
            headers: {
              'Authorization':  `Bearer ${token}`
            }
          })
          setPosts(response.data)
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
    }
  };

  const handleEdit = (post) => {
    navigate("/askshare", { state: { editPost: post } });
  };

  const renderPosts = (posts) => {
    return posts.map(post => (
      <div 
        key={post.id} 
        className={`h-48 p-4 cursor-pointer bg-transparent shadow-lg rounded-lg ${post.type === 'Advice' ? 'border-green border-4' : post.type === 'Question' ? 'border-mustard border-4' : ''} flex flex-col justify-between`}
      >
        <div className='flex flex-col space-y-3'>
          <p className="text-brown text-lg font-semibold line-clamp-2">{post.title}</p>
          <p className="text-sm text-center">{post.category}</p>
          <div className="flex gap-6 items-center text-sm mt-auto justify-center">
            <span><FontAwesomeIcon icon={faComment} color={post.type === 'Advice' ? '#A3B18A' : '#D8973C'} /> {post.comments.length}</span>
            <span><FontAwesomeIcon icon={faBookmark} color={post.type === 'Advice' ? '#A3B18A' : '#D8973C'} /> {post.saved_by.length}</span>
          </div>
        </div>
        <div>
          <div className="mt-2">
            <div className='flex flex-row gap-4 items-center justify-center'>
              <button onClick={() => handleEdit(post)} className="flex flex-row gap-2 justify-center items-center bg-green text-cream font-bold py-2 px-4 rounded text-sm">
                <FontAwesomeIcon icon={faPenToSquare} />
                Edit
              </button>
              <button onClick={() => handleDelete(post.id)} className="flex flex-row gap-2 justify-center items-center bg-orange text-cream font-bold py-2 px-4 rounded text-sm">
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </div>
          <p className="text-xs text-brown mt-2">
            Date & Time: {post.created_at}
          </p>
        </div>
      </div>

    ));
  };

  return (
    <Layout>
      <div className='w-5/6 items-center justify-center text-center'>
      <div className='flex flex-row items-center'>
          <button
            className="cursor-pointer flex items-center"
            onClick={() => navigate('/account/')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h3 className='text-center flex-grow'>U S E R &nbsp; U P L O A D S</h3>
        </div>
        
        <div className="flex gap-4">
          <div className="w-full md:w-1/2 p-4">
            <h4 className="mb-4">A D V I C E</h4>
            {posts.filter(post => post.type === 'Advice').length === 0 ? (
              <p>No advice posted</p>
            ) : (
              <div id="advicePosts" className="flex flex-col gap-4">
                {renderPosts(posts.filter(post => post.type === 'Advice'))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-4">
            <h4 className="mb-4">A S K</h4>
            {posts.filter(post => post.type === 'Question').length === 0 ? (
              <p>No questions asked</p>
            ) : (
              <div id="askPosts" className="flex flex-col gap-4">
                {renderPosts(posts.filter(post => post.type === 'Question'))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserUploads;
