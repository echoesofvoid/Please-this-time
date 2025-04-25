// Firebase services for admin authentication
import { db } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createHash } from 'crypto';

// Admin service
export const adminService = {
  // Check if admin password is correct
  checkAdminPassword: async (password) => {
    try {
      // Hash the password for comparison
      const hashedPassword = createHash('sha256').update(password).digest('hex');
      
      // Get the stored admin credentials
      const adminRef = doc(db, 'admin', 'credentials');
      const adminSnap = await getDoc(adminRef);
      
      if (adminSnap.exists()) {
        // Compare the hashed password with the stored one
        return adminSnap.data().password === hashedPassword;
      } else {
        // If no admin credentials exist yet, create them with this password
        await setDoc(adminRef, {
          password: hashedPassword,
          createdAt: new Date()
        });
        return true;
      }
    } catch (error) {
      console.error('Error checking admin password:', error);
      return false;
    }
  },
  
  // Update admin password
  updateAdminPassword: async (newPassword) => {
    try {
      // Hash the new password
      const hashedPassword = createHash('sha256').update(newPassword).digest('hex');
      
      // Update the admin credentials
      const adminRef = doc(db, 'admin', 'credentials');
      await setDoc(adminRef, {
        password: hashedPassword,
        updatedAt: new Date()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error updating admin password:', error);
      return false;
    }
  }
};
