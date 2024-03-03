import React, { useState, useEffect } from 'react';
import { useSharedContext } from '../components/SharedContext';
import axios from 'axios';
import "../styles/SearchHistory.css"

const SearchHistory: React.FC = () => {
  const { searchHistory, setTypedText, setSelectedTerm } = useSharedContext();
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    console.log("searchHistory updated:", searchHistory);
    setFetchedImages([]);
  }, [searchHistory]);

  const handleHistoryClick = async (term: string) => {
    setTypedText(term);
    setSelectedTerm(term);

    try {
      const accessKey = 'Lzpmn_WcaJSeTbFYxEqTOEU189UubYaYdFz3wJ0EAbk';
      const perPage = 20;

      const totalImagesResponse = await axios.get(
        `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${term}&per_page=1`
      );
      const totalImages = totalImagesResponse.data.total || 0;
      setTotalPages(Math.ceil(totalImages / perPage));

      for (let page = 1; page <= totalPages; page++) {
        const apiUrl = `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${term}&per_page=${perPage}&page=${page}`;
        const response = await axios.get(apiUrl);
        const data = response.data.results || response.data;
        const imageUrls = data.map((image: any) => image.urls.regular);
        setFetchedImages((prevImages) => [...prevImages, ...imageUrls]);
      }

    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <div>
      <h2>Search History</h2>
      <ul>
        {searchHistory.map((term, index) => (
          <li className='list-item' key={index} onClick={() => handleHistoryClick(term)}>
             <p>{term}</p> 
          </li>
        ))}
      </ul>

      <div className="image-container">
        {fetchedImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`${index}`} />
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;