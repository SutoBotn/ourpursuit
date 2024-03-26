import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/layout";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faExclamationCircle, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const AskShare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editPost } = location.state || {}
  const [categories, setCategories] = useState([])
  const token = sessionStorage.getItem('access');

  const [postType, setPostType] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [userID, setUserID] = useState(null);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        //const response = await axios.get('http://localhost:8000/api/get-categories');
      const response = await axios.get('/api/get-categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    const userid = async () => {
      //const response = await axios.get('http://localhost:8000/api/user_id/',{
      const response = await axios.get('/api/user_id/',{
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      if (response.data.user_id) {
        setUserID(response.data.user_id)
      } else {
        setPostError("You need to be logged in to post")
      }
    }
    if (editPost) {
      if (editPost.type === "Question") {
        setPostType("Q")
      } else {
        setPostType("A")
      }
      setCategory(editPost.category_id)
      console.log("Category ID:", editPost.category_id, typeof editPost.category_id);

      setTitle(editPost.title)
      setBody(editPost.body)
      setImage(editPost.image)
    }
    

    userid();
    fetchCategories();
  }, [token, userID, editPost]);

  const handleImageChange = (event) => {
    const uploadedImage = event.target.files[0];
    setImage(uploadedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('post_type', postType);
    formData.append('body', body);
    
    if (image) {
      formData.append('image', image);
    }

    try {
      let response;
      if (editPost) {
        // Editing existing post
        //response = await axios.post(`http://localhost:8000/api/edit-post/${editPost.id}/`, formData, {
        response = await axios.post(`/api/edit-post/${editPost.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
      } else {
        // Creating new post
        // response = await axios.post('http://localhost:8000/api/create-post/', formData, {
        response = await axios.post('/api/create-post/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
      }

      if (response) {
        navigate(`/discussion/${response.data.category}/${response.data.post_id}`)
        console.log('Post created')
      } else {
        console.error('Post failed:', response)
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
      setPostError(error.response.data.error)
      setTimeout(() => {
        setPostError(null);
    }, 2000);
    }
  }

  return (
    <Layout>
      <div className="w-5/6 bg-transparent border-orange border-8 overflow-hidden rounded-lg mx-auto py-8 px-10">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 w-1/2 justify-center">
            <select
              id="postType"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className={`w-full p-2 rounded border-4 focus:outline-none bg-white border-green text-green font-bold ${!userID && 'bg-opacity-50 pointer-events-none'}`}
              disabled={!userID}
            >
              <option value="" disabled>Select Post Type</option>
              <option value="Q">Question</option>
              <option value="A">Advice</option>
            </select>
            <label htmlFor="imageUpload" className={`w-full mt-4 bg-white rounded border-4 border-green px-4 py-2 flex items-center justify-between cursor-pointer ${!userID && 'bg-opacity-40 border-opacity-80 pointer-events-none'}`}>
              <span className={`text-green font-bold ${!userID && 'text-opacity-70'}`}>{image ? "Image Selected" : "Choose Image"}</span>
              <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={!userID}
              />
            </label>

            {image && (
              <div className="w-48 h-48 flex items-center self-center justify-center mt-6 md:mt-0">
                {typeof image === 'string' ? (
                  <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                ) : (
                  <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-full h-full object-cover" />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
              }}
              className={`w-full p-2 rounded border-4 focus:outline-none border-green text-green font-bold bg-white ${!userID && ' bg-opacity-50 pointer-events-none'}`}
              disabled = {!userID}
            >
              <option value="" disabled>Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              type="text"
              id="postTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (Max 70 characters)"
              className="w-full mt-4 p-2 rounded border-4 focus:outline-none border-green"
              disabled={!userID}
            />
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body (Max 500 characters)"
              className="w-full mt-4 p-2 rounded border-4 focus:outline-none border-green"
              rows="5"
              disabled={!userID}
            ></textarea>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          className={`w-full mt-6 text-lg px-8 py-3 uppercase text-center bg-mustard text-cream font-bold focus:outline-none focus:ring focus:ring-offset-2 rounded-full ${!userID ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={!userID}
        >
          {editPost ? 
            <div className="flex flex-row gap-2 justify-center items-center ">
              <FontAwesomeIcon icon={faPenToSquare} /> 
              Edit
            </div>
          :
            <div className="flex flex-row gap-2 justify-center items-center ">
              <FontAwesomeIcon icon={faCirclePlus} /> 
              Post
            </div>
          }
        </button>
        {/* Error message */}
        {postError && (
          <p className="text-error text-center mt-2 ml-2">{postError} <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/></p>
        )}
      </div>
    </Layout>
  );
};

export default AskShare;