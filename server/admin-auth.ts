import bcrypt from 'bcrypt';
import Database from '@replit/database';

const db = new Database();

interface Admin {
  email: string;
  hashedPassword: string;
}

export class AdminAuth {
  // Initialize admin account if it doesn't exist
  static async initializeDefaultAdmin() {
    try {
      const existingAdmin = await db.get('admin:evaanilearn@gmail.com');
      
      if (!existingAdmin) {
        // Create default admin account
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash('V@an!@#123', saltRounds);
        
        const adminData: Admin = {
          email: 'evaanilearn@gmail.com',
          hashedPassword
        };
        
        await db.set('admin:evaanilearn@gmail.com', adminData);
        console.log('Default admin account created successfully');
      } else {
        console.log('Admin account already exists');
      }
    } catch (error) {
      console.error('Error initializing admin account:', error);
    }
  }

  // Authenticate admin credentials
  static async authenticateAdmin(email: string, password: string): Promise<boolean> {
    try {
      const adminData = await db.get(`admin:${email}`);
      
      if (!adminData || typeof adminData !== 'object') {
        return false;
      }
      
      const admin = adminData as Admin;
      const isValidPassword = await bcrypt.compare(password, admin.hashedPassword);
      return isValidPassword;
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return false;
    }
  }

  // Get admin data (excluding password)
  static async getAdmin(email: string): Promise<Omit<Admin, 'hashedPassword'> | null> {
    try {
      const adminData = await db.get(`admin:${email}`);
      
      if (!adminData || typeof adminData !== 'object') {
        return null;
      }
      
      const admin = adminData as Admin;
      return {
        email: admin.email
      };
    } catch (error) {
      console.error('Error getting admin data:', error);
      return null;
    }
  }
}