import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faBookmark } from '@fortawesome/free-solid-svg-icons';

import ProfileImage from '../../assets/images/profile-image.png'

const SavedPosts = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('access');

    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [filterOption, setFilterOption] = useState('All'); 

  useEffect(() => {
    const fetchSavedPosts = async () => {
        try {
        //   const response = await axios.get('http://localhost:8000/api/saved-posts/', {
        const response = await axios.get('https://ourpursuit-7f3fda83b565.herokuapp.com/api/saved-posts/', {
            headers: {
                'Authorization': `Bearer ${token}`
              },
          });
          setPosts(response.data);
          setFilteredPosts(response.data);
        } catch (error) {
          console.error('Error fetching recent posts:', error);
        }
    };
    
    fetchSavedPosts();
  }, [token]);

  const handleFilterChange = (e) => {
    const option = e.target.value;
    setFilterOption(option);

    // Filter posts based on the selected option
    if (option === 'All') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => post.type === option);
      setFilteredPosts(filtered);
    }
  };

  return (
    <Layout>
        <div className="w-5/6 mx-auto mt-10">
            <div className='flex flex-row justify-between mb-6'>
                <button
                    className="mb-4 cursor-pointer flex items-center"
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
                <h3>S A V E D</h3>
                {/* Filter Dropdown */}
                <div className="mb-4">
                    <select
                        value={filterOption}
                        onChange={handleFilterChange}
                        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
                    >
                        <option value="All">All</option>
                        <option value="Advice">Advice</option>
                        <option value="Questions">Questions</option>
                    </select>   
                </div>
            </div>

            {filteredPosts.length === 0 && (
                <p className="text-center text-lg">
                    {filterOption === 'All' ? 'No posts available.' : `No ${filterOption.toLowerCase()} posts available. Try unfiltering to see more posts.`}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredPosts.map((item) => (
                    <div
                        key={item.id}
                        className={`h-48 p-4 items-center justify-center cursor-pointer bg-transparent shadow-lg rounded-lg ${item.type === 'Advice' ? 'border-green border-4' : item.type === 'Question' ? 'border-mustard border-4' : ''}`}
                        onClick={() => navigate(`/discussion/${item.category}/${item.id}`)}
                    >
                        <div className='flex flex-row items-center gap-3 mb-2'>
                            <div className="rounded-full w-8 h-8 flex items-center justify-center mb-2 overflow-hidden mt-2" style={{ minWidth: '2rem', minHeight: '2rem' }}>
                                {item.profile_image ? (
                                    <img src={item.profile_image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <img src={ProfileImage} alt='Default Profile Icon' className="w-full h-full rounded-full object-cover" />
                                )}
                            </div>
                            <p className="text-lg font-semibold mb-1 line-clamp-2">{item.title}</p>
                        </div>

                        <div className='flex flex-row justify-center gap-6'>
                            <p className="text-sm text-center">{item.type}</p>
                            <p className="text-sm text-center">{item.category}</p>
                        </div>

                        <div className="flex gap-6 items-center text-sm mt-auto justify-center">
                            <span><FontAwesomeIcon icon={faComment} color={item.type === 'Advice' ? '#A3B18A' : '#D8973C'} /> {item.comments}</span>
                            <span><FontAwesomeIcon icon={faBookmark} color={item.type === 'Advice' ? '#A3B18A' : '#D8973C'} /> {item.saved_by}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Layout>
  );
};

export default SavedPosts;
