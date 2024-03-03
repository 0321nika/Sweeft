import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PhotoGallery.css';
import { useSharedContext } from './SharedContext';
import { Link } from 'react-router-dom';

interface Photo {
  id: string;
  urls: {
    regular: string;
    full: string;
  };
  alt_description: string;
  views: number;
  likes: number;
}

const PhotoGallery: React.FC = () => {
  const { typedText, setTypedText, addToSearchHistory } = useSharedContext();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [page, setPage] = useState<number>(1);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const accessKey = 'Lzpmn_WcaJSeTbFYxEqTOEU189UubYaYdFz3wJ0EAbk';
    let apiUrl = `https://api.unsplash.com/photos/?client_id=${accessKey}&per_page=20&order_by=popular&page=${page}`;

    if (searchTerm) {
      apiUrl = `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${searchTerm}&per_page=20&page=${page}`;
    }

    const cachedData = localStorage.getItem(apiUrl);

    if (cachedData) {
      setPhotos((prevPhotos) => {
        if (page === 1) {
          return JSON.parse(cachedData);
        } else {
          return [...prevPhotos, ...JSON.parse(cachedData)];
        }
      });
    } else {  
      const delay = 1000; 
      const timeoutId = setTimeout(() => {
        axios
          .get(apiUrl)
          .then((response) => {
            const data = response.data.results || response.data;
            setPhotos((prevPhotos) => {
              if (page === 1) {
                return data;
              } else {
                return [...prevPhotos, ...data];
              }
            });
            localStorage.setItem(apiUrl, JSON.stringify(data));
          })
          .catch((error) => {
            console.error('Error fetching photos:', error);
          });
      }, delay);

      return () => {
        clearTimeout(timeoutId); 
        setSelectedPhoto(null);
      };
    }
  }, [searchTerm, page]);

  useEffect(() => {
    localStorage.setItem('typedText', typedText);
  }, [typedText]);

  const openModal = async (photo: Photo) => {
    const accessKey = 'Lzpmn_WcaJSeTbFYxEqTOEU189UubYaYdFz3wJ0EAbk';
    try {
      const response = await axios.get(`https://api.unsplash.com/photos/${photo.id}?client_id=${accessKey}`);
      const fullPhotoData: Photo = response.data;
      setSelectedPhoto(fullPhotoData);
    } catch (error) {
      console.error('Error fetching full photo data:', error);
    }
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <Link to={"./history"} >history</Link>
      <h1>Unsplash Photo Gallery</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
          localStorage.setItem('searchTerm', e.target.value);
          setTypedText(e.target.value);
          addToSearchHistory(e.target.value);
        }}
      />

      <div className="photo-container">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item" onClick={() => openModal(photo)}>
            <img src={photo.urls.regular} alt={photo.alt_description} />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="modal">
          <div className="modal-content">
            <img src={selectedPhoto.urls.full} alt={selectedPhoto.alt_description} />
            <p>Views: {selectedPhoto.views}</p>
            <p>Likes: {selectedPhoto.likes}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default PhotoGallery;