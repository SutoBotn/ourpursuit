import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout';
import axios from 'axios';
import Comment from './Comment';
import ProfileImage from '../../../assets/images/profile-image.png'
import { ArrowLeftIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faComment } from '@fortawesome/free-solid-svg-icons';

const Post = () => {
  const navigate = useNavigate();
  const { category, id } = useParams();
  const [postData, setPostData] = useState({})
  const [commentText, setCommentText] = useState('')
  const [userID, setUserID] = useState(null)
  const token = sessionStorage.getItem('access');
  const [postSaved, setPostSaved] = useState(false)
  const [commentError, setCommentError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // const response = await axios.get(`http://localhost:8000/api/posts/${category}/${id}`)
        const response = await axios.get(`https://ourpursuit-7f3fda83b565.herokuapp.com/api/posts/${category}/${id}`)
        setPostData(response.data)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    const userid = async () => {
        // const response = await axios.get('http://localhost:8000/api/user_id/',{
        const response = await axios.get('https://ourpursuit-7f3fda83b565.herokuapp.com/api/user_id/',{
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })
        setUserID(response.data.user_id)
    }
    const saved = async () => {
      try {
        // const response = await axios.get(`http://localhost:8000/api/posts/${id}/check-saved/`, {
        const response = await axios.get(`https://ourpursuit-7f3fda83b565.herokuapp.com/api/posts/${id}/check-saved/`, { 
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })
        setPostSaved(response.data.is_saved)
      } catch (error) {
        console.error('Error checking saved:', error)
      }
    }

    fetchPost();
    userid();
    saved();
  }, [category, id, userID, token, postSaved]);

  const handleCommentSubmit = async () => {
    try {
      // const response = await axios.post(`http://localhost:8000/api/posts/${category}/${id}/create-comment/`, {
      const response = await axios.post(`https://ourpursuit-7f3fda83b565.herokuapp.com/api/posts/${category}/${id}/create-comment/`, {
        text: commentText
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response){
        // const updatedPostResponse = await axios.get(`http://localhost:8000/api/posts/${category}/${id}`);
        const updatedPostResponse = await axios.get(`https://ourpursuit-7f3fda83b565.herokuapp.com/api/posts/${category}/${id}`);
        setPostData(updatedPostResponse.data);
        setCommentText('');
      }
    } catch (error) {
      setCommentError(error.response.data.error)
      setTimeout(() => {
        setCommentError(null);
    }, 2000);
      console.error('Error submitting comment:', error);
    }
  };
  
  const handleSavePost = async () => {
    try {
      // const response = await axios.post(`http://localhost:8000/api/posts/${id}/save-post/`, null, {
      const response = await axios.post(`https://ourpursuit-7f3fda83b565.herokuapp.com/api/posts/${id}/save-post/`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setPostSaved(response.data.is_saved)
      console.log(response.data);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <Layout>
      <div className="w-5/6 mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate("/discussion/" + postData.category)} className="mr-2 flex flex-row gap-1 items-center">
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold">{postData.title}</h1>
          <div className="flex items-center">
          {userID && (
          <button 
            className="flex flex-row gap-1 items-center mr-2 bg-orange text-cream font-bold py-2 px-4 rounded"
            onClick={() => handleSavePost()}
          >
            {postSaved ? (
              <BookmarkIconSolid className="w-5 h-5 mr-1" /> 
            ) : (
              <BookmarkIcon className="w-5 h-5 mr-1" />
            )}
            {postSaved ? 'Saved' : 'Save'}
          </button>
        )}
            <span className="text-mustard font-bold">{postData.category}</span>
          </div>
        </div>

        <div className="flex flex-col items-start mb-4 border-4 p-4 border-orange">
          <div className='flex flex-row items-center'>
            <img
              src={postData.profile_image || ProfileImage}
              alt="User Profile"
              className="w-8 h-8 rounded-full mr-4"
            />
            <span className="font-bold">{postData.writer}</span>
          </div>

          <div className="ml-12">
            <div className="flex items-center">
              <p className={postData.image ? "mr-4" : ""}> 
                {postData.body}
              </p>
              {postData.image && ( 
                <img
                  src={postData.image}
                  alt="Posted"
                  className="w-40 h-40 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        </div>

        {/* Display Replies */}
        <div>
          {postData.comments ? 
            postData.comments.map((comment, id) => (
                <Comment key={id} comment={comment} user={userID} postData={postData} setPostData={setPostData} />
            ))
            :
            <p>No replies yet</p>
          }
        </div>

        <div className="flex items-center mt-4 gap-4">
          <textarea 
            className='flex-1 p-2 border border-green rounded-1' 
            placeholder={userID ? "Write your reply..." : "Login to reply"}
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)} 
            disabled={!userID}
          />
          <button 
              onClick={handleCommentSubmit} 
              className={`flex flex-row gap-2 justify-center items-center w-1/5 text-center bg-mustard text-cream font-bold py-2 px-4 rounded ${!userID ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={!userID}
          >
              <FontAwesomeIcon icon={faComment} /> 
              Submit
          </button>
        </div>
        {/* Error message */}
        {commentError && (
          <p className="text-error mt-2 ml-2">{commentError} <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/></p>
        )}

      </div>
    </Layout>
  );
};

export default Post;

// <button
//   onClick={handleCameraUpload}
//   className="bg-green text-cream p-2 rounded-r"
// >
//   Camera
// </button> 


// const handleCameraUpload = () => {
//   // Function to handle camera upload
//   // Implement your logic here
// };


// {/* {postData.comments ? 
//   postData.comments.map((reply, id) => (
//     <div key={id} className="flex items-start mb-4 border-green border-4 p-4">
//       <img
//         src={reply.profile_image || ProfileImage}
//         alt="User Profile"
//         className="w-8 h-8 rounded-full mr-4"
//       />
//       <div>
//         <span className="font-bold">{reply.author}</span>
//         <p className="mt-2">{reply.text}</p>
//       </div>
//     </div>
//   ))
//   :
//   <p>No replies yet</p>
// } */}

