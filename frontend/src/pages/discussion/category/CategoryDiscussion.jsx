import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import ProfileImage from '../../../assets/images/profile-image.png';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterOption, setFilterOption] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        //const response = await axios.get(`http://localhost:8000/api/posts/${category}/`)
        const response = await axios.get(`https://our-pursuit-418201.nw.r.appspot.com/api/posts/${category}/`)
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    fetchPosts();
  }, [category]);

  // Function to handle filter selection
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
        <div className='flex flex-row justify-between mb-4'>
          <div onClick={() => navigate('/discussion/')}>
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
          </div>
          <h1 className="text-2xl font-bold mb-6">{category}</h1>
          {/* Filter Dropdown */}
          <div className="mb-4">
            <select
              value={filterOption}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-md border focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Advice">Advice</option>
              <option value="Question">Questions</option>
            </select>
          </div>
        </div>
  
        {filteredPosts.length === 0 && (
          <p className="text-center text-lg">
            {filterOption === 'All' ? 'No posts available.' : `No ${filterOption.toLowerCase()} posts available. Try unfiltering to see more posts.`}
          </p>
        )}
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPosts.map((item) => (
            <div 
              key={item.id} 
              className={`flex flex-row p-4 items-start justify-start cursor-pointer bg-transparent shadow-lg rounded-lg ${item.type === 'Advice' ? 'border-green border-4' : item.type === 'Question' ? 'border-mustard border-4' : ''}`}
              onClick={() => navigate(`/discussion/${category}/${item.id}`)}
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center mb-2 overflow-hidden mt-2">
                {item.profile_image ? (
                  <img src={item.profile_image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <img src={ProfileImage} alt='Default Profile Icon' className="w-full h-full rounded-full object-cover" />
                )}
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg text-left font-semibold mb-2">{item.title}</h3>
                <p className="text-sm mb-2">{item.type}</p>
                
                <div className="flex lg:gap-6 gap-32 items-center text-sm mt-auto">
                  <span><FontAwesomeIcon icon={faComment} color={item.type === 'Advice' ? '#A3B18A' : '#D8973C'} /> {item.comments}</span>
                  <span><FontAwesomeIcon icon={faBookmark} color={item.type === 'Advice' ? '#A3B18A' : '#D8973C'} /> {item.saved_by}</span>
                </div>
                <p className="text-sm mt-6 text-right">Uploaded: {item.created_at}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
