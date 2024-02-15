import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';

const useFavorites  = () => {
  const { userFavorites, setUserFavorites } = useContext(UserContext);

  const toggleFavorite = async (blog) => {
    const isCurrentlyFavorite = userFavorites.some(favorite => favorite._id === blog._id)
    const apiUrl = `http://localhost:8080/api/user/${isCurrentlyFavorite ? 'remFromFav' : 'addToFav'}/${blog._id}`


    //updating the UI
    const updatedFavorites = isCurrentlyFavorite
      ? userFavorites.filter(favorite => favorite._id !== blog._id)
      : [...userFavorites, blog];
    
    setUserFavorites(updatedFavorites);

        try {
          await axios.put(apiUrl, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
          })
        } catch (error) {
          setUserFavorites(userFavorites);
          return false;
        }
        // Optionally, return true to indicate success
        return true;
      }

    
      const isFavorite = (blogId) => {
        return userFavorites.some(favorite => favorite._id === blogId)
      }

      return { toggleFavorite, isFavorite, userFavorites}
}

export default useFavorites;
