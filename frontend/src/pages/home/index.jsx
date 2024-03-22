import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';

// import SimpleBar from 'simplebar-react';
import axios from 'axios';

import HomePic from '../../assets/images/home.jpg';
import ProfileImage from '../../assets/images/profile-image.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faBookmark } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/recent-posts/');
        setRecentPosts(response.data);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    const fetchPopularPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/popular-posts/');
        setPopularPosts(response.data);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    fetchRecentPosts();
    fetchPopularPosts();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col w-5/6 md:flex-row md:space-x-6">
        <div className="md:w-2/3">
          <img src={HomePic} alt="Friends" className="w-full h-auto md:h-full object-cover" />
        </div>

        <div className="bg-orange md:w-1/3 flex flex-col justify-center p-8">
          <h1 className="text-cream mb-4 text-2xl text-center">Discover a supportive community where individuals pursue their ambitions</h1>
          <p className="text-cream text-6xl font-Better text-center">together</p>
        </div>
      </div>

      {/* <div className="flex flex-row gap-3 mt-8 w-5/6">
        <div className="text-sm sm:text-md md:text-xl w-96 font-bold text-cream bg-mustard text-center flex justify-center items-center h-48">R E C E N T<br />U P L O A D S</div>
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          <SimpleBar autoHide={false} style={{ width: 'auto' }}>
            <div className="flex flex-row gap-2">
              {recentPosts.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex-shrink-0 h-[11rem] w-64 p-4 items-center justify-center cursor-pointer bg-transparent shadow-lg rounded-lg ${item.type === 'Advice' ? 'border-green border-4' : item.type === 'Question' ? 'border-mustard border-4' : ''}`}
                  onClick={() => navigate(`/discussion/${item.category}/${item.id}`)}
                >
                  <div className="ml-4 flex-grow">
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
                </div>
              ))}
            </div>
          </SimpleBar>
        </div>
      </div> */}

      <div className="flex flex-row gap-3 mt-8 w-5/6">
        <div className="text-sm sm:text-md md:text-xl w-96 font-bold text-cream bg-mustard text-center flex justify-center items-center h-48">R E C E N T<br />U P L O A D S</div>
          <div className="flex overflow-x-scroll scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar scrollbar-h-2 scrollbar-thumb-orange h-48">
            <div className="flex flex-row gap-2">
              {recentPosts.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex-shrink-0 h-[11rem] w-64 p-4 items-center justify-center cursor-pointer bg-transparent shadow-lg rounded-lg ${item.type === 'Advice' ? 'border-green border-4' : item.type === 'Question' ? 'border-mustard border-4' : ''}`}
                  onClick={() => navigate(`/discussion/${item.category}/${item.id}`)}
                >
                  <div className="ml-4 flex-grow">
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
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 mt-8 w-5/6">
        <div className="text-sm sm:text-md md:text-xl w-96 font-bold text-cream bg-mustard text-center flex justify-center items-center h-48">M O S T<br />P O P U L A R</div>
          <div className="flex overflow-x-scroll scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar scrollbar-h-2 scrollbar-thumb-orange h-48">
            <div className="flex flex-row gap-2">
              {popularPosts.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex-shrink-0 h-[11rem] w-64 p-4 items-center justify-center cursor-pointer bg-transparent shadow-lg rounded-lg ${item.type === 'Advice' ? 'border-green border-4' : item.type === 'Question' ? 'border-mustard border-4' : ''}`}
                  onClick={() => navigate(`/discussion/${item.category}/${item.id}`)}
                >
                  <div className="ml-4 flex-grow">
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
                </div>
              ))}
            </div>
        </div>
      </div>

      
    </Layout>
  );
}

export default Home;
