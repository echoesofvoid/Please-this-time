// Firebase services for characters
import { db, storage } from './config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Characters service
export const charactersService = {
  // Get all characters
  getAllCharacters: async () => {
    try {
      const charactersRef = collection(db, 'characters');
      const q = query(charactersRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const characters = [];
      querySnapshot.forEach((doc) => {
        characters.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return characters;
    } catch (error) {
      console.error('Error getting characters:', error);
      return [];
    }
  },
  
  // Get a single character by ID
  getCharacter: async (characterId) => {
    try {
      const characterRef = doc(db, 'characters', characterId);
      const characterSnap = await getDoc(characterRef);
      
      if (characterSnap.exists()) {
        return {
          id: characterSnap.id,
          ...characterSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting character:', error);
      return null;
    }
  },
  
  // Create or update a character
  saveCharacter: async (characterId, characterData, imageFile = null) => {
    try {
      const characterRef = doc(db, 'characters', characterId);
      const timestamp = new Date();
      let updatedData = { ...characterData };
      
      // Upload image if provided
      if (imageFile) {
        const storageRef = ref(storage, `characters/${characterId}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        updatedData.imageUrl = imageUrl;
      }
      
      // Check if character exists
      const characterSnap = await getDoc(characterRef);
      
      if (characterSnap.exists()) {
        // Update existing character
        await updateDoc(characterRef, {
          ...updatedData,
          updatedAt: timestamp
        });
      } else {
        // Create new character
        await setDoc(characterRef, {
          ...updatedData,
          createdAt: timestamp,
          updatedAt: timestamp
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error saving character:', error);
      return false;
    }
  },
  
  // Delete a character
  deleteCharacter: async (characterId) => {
    try {
      // Delete character document
      await deleteDoc(doc(db, 'characters', characterId));
      
      // Delete character image if exists
      try {
        const storageRef = ref(storage, `characters/${characterId}`);
        await deleteObject(storageRef);
      } catch (error) {
        // Image might not exist, ignore error
        console.log('No image to delete or error deleting image:', error);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting character:', error);
      return false;
    }
  }
};
