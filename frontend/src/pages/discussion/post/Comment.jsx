import React, { useState } from 'react';
import axios from 'axios';
import ProfileImage from '../../../assets/images/profile-image.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faFloppyDisk, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Comment = ({ comment, user, setPostData, postData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const token = sessionStorage.getItem('access');
    const [commentError, setCommentError] = useState(null)

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            // const response = await axios.post(`http://localhost:8000/api/posts/${comment.post_id}/${comment.id}/update-comment/`, { editedText }, {
            const response = await axios.post(`https://our-pursuit-418201.nw.r.appspot.com/api/posts/${comment.post_id}/${comment.id}/update-comment/`, { editedText }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }, 
            });
            console.log(response.data);
            setIsEditing(false);
            setPostData(prevData => ({
                ...prevData,
                comments: prevData.comments.map(c => c.id === comment.id ? { ...c, text: editedText } : c)
            }));
        } catch (error) {
            setCommentError(error.response.data.error)
            setTimeout(() => {
                setCommentError(null);
            }, 2000);
            console.error(error);
        }
    };
    

    const handleDelete = async () => {
        try {
            // const response = await axios.delete(`http://localhost:8000/api/posts/${comment.post_id}/${comment.id}/delete-comment/`,{
            const response = await axios.delete(`https://our-pursuit-418201.nw.r.appspot.com/api/posts/${comment.post_id}/${comment.id}/delete-comment/`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log(response.data);
            setPostData(prevData => ({
                ...prevData,
                comments: prevData.comments.filter(c => c.id !== comment.id)
            }));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`mb-4 p-4 border-4 border-mustard ${user === comment.user_id && 'border-green'} ${postData.writer_id === comment.user_id && 'border-orange'}`}>
            <div className="flex items-start">
                <img
                  src={comment.profile_image || ProfileImage}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full mr-4"
                />
                <div className='w-full'>
                  <span className="font-bold">{comment.author}</span>
                  {isEditing ? (
                    <div>
                        <textarea 
                            className='w-full border border-green p-2 mt-2' 
                            value={editedText} 
                            onChange={(e) => setEditedText(e.target.value)} 
                        />
                        {commentError && (
                            <p className="text-error text-center mt-2 ml-2">{commentError} <FontAwesomeIcon icon={faExclamationCircle} color='#DC143C'/></p>
                        )}                    
                    </div>
                  ) : (
                      <p className="mt-2">{comment.text}</p>
                  )}
                </div>
            </div>
            {user === comment.user_id && (
                <div className="flex flex-row justify-center items-center gap-4 mt-2">
                    {isEditing ? (
                        <button 
                            onClick={handleSave} 
                            className='flex flex-row gap-2 items-center mr-2 bg-green text-cream font-bold py-2 px-4 rounded'
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} /> 
                            Save
                        </button>
                    ) : (
                        <button 
                            onClick={handleEdit} 
                            className='flex flex-row gap-2 items-center mr-2 bg-green mt-2 text-cream font-bold py-2 px-4 rounded'
                        >
                            <FontAwesomeIcon icon={faPenToSquare} /> 
                            Edit
                        </button>
                    )}
                    <button 
                        onClick={handleDelete} 
                        className='flex flex-row gap-2 items-center mr-2 bg-orange text-cream font-bold py-2 px-4 rounded'
                    >
                        <FontAwesomeIcon icon={faTrash} /> 
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default Comment;
