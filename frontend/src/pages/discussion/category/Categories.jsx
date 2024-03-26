import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout';
import axios from 'axios';

const CategoriesPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const response = await axios.get('http://localhost:8000/api/get-categories/');
        const response = await axios.get('/api/get-categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories();
  }, [])

  const handleCategorySelection = (selectedCategory) => {
    navigate(`/discussion/${selectedCategory}`)
  };

  return (
    <Layout>
      <div className="w-5/6 mx-auto mt-2">
        <h3 className='italic text-center'>WHAT'S ON YOUR MIND?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {categories.map((category, index) => (
            <button
              key={index}
              className="relative w-full bg-green text-brown font-bold py-16 rounded opacity-90 flex flex-col justify-center items-center focus:outline-none hover:opacity-100"
              onClick={() => handleCategorySelection(category.name)}
            >
              <span className="text-lg z-10 uppercase mb-2">
                {category.name.split('').map((char, index) => (
                  <span key={index}>&nbsp;{char}</span>
                ))}
              </span>
              <img
                src={category.icon}
                alt={`${category.name} icon`}
                className="absolute opacity-40 w-24 z-0"
              />
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
