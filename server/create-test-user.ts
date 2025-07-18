import { storage } from './storage';
import { hashPassword } from './auth';

export async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await storage.getUserByEmail('teststudent@vaani.com');
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test student account
    const hashedPassword = await hashPassword('test1234');
    const testUser = await storage.createUser({
      name: 'Test Student',
      email: 'teststudent@vaani.com',
      username: 'teststudent',
      password: hashedPassword,
    });

    console.log('Test student account created:', {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
      username: testUser.username
    });
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}