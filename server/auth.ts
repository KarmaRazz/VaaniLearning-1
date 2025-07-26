import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { signupSchema, loginSchema } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 12;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(user: { id: number; email: string; name: string; role: string }): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check for token in cookies first, then in Authorization header
  let token = req.cookies?.token;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Verify user still exists in database
  const user = await storage.getUser(decoded.id);
  if (!user) {
    return res.status(403).json({ error: 'User not found' });
  }

  req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
  next();
}

export async function signup(req: Request, res: Response) {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      });
    }

    const { name, username, email, password, gender, goalId, phoneNumber } = validationResult.data;

    // Check for unique credentials (username, email, phone)
    const credentialConflict = await storage.checkUniqueCredentials(username, email, phoneNumber);
    if (credentialConflict) {
      let errorMessage = '';
      switch (credentialConflict.field) {
        case 'username':
          errorMessage = 'Username already exists';
          break;
        case 'email':
          errorMessage = 'Email address already registered';
          break;
        case 'phoneNumber':
          errorMessage = 'Phone number already in use';
          break;
        default:
          errorMessage = 'Username, email, or phone number already in use';
      }
      return res.status(409).json({ error: errorMessage, field: credentialConflict.field });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await storage.createUser({
      name,
      username,
      email,
      password: hashedPassword,
      gender,
      goalId,
      phoneNumber,
      role: "STUDENT", // Default role for new users
    });

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      });
    }

    const { email, password } = validationResult.data;

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Configure multer for profile picture uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pics');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const profilePicUpload = multer({ 
  storage: profilePicStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const error = new Error('Only image files are allowed') as any;
      error.code = 'INVALID_FILE_TYPE';
      cb(error, false);
    }
  }
});

export const uploadProfilePic = profilePicUpload.single('profilePic');

export async function handleProfilePicUpload(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Get the current user
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if it exists
    if (user.profilePic) {
      const oldPicPath = path.join(process.cwd(), 'public', user.profilePic);
      if (fs.existsSync(oldPicPath)) {
        fs.unlinkSync(oldPicPath);
      }
    }

    // Generate the relative path for the database
    const profilePicPath = `/uploads/profile-pics/${req.file.filename}`;

    // Update user profile pic in database
    const updatedUser = await storage.updateUserProfilePic(req.user.id, profilePicPath);
    
    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePic: profilePicPath
    });
  } catch (error) {
    console.error('Profile pic upload error:', error);
    
    // Clean up the uploaded file if database update failed
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function handleProfilePicDelete(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Get the current user
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.profilePic) {
      return res.status(400).json({ error: 'No profile picture to delete' });
    }

    // Delete the physical file
    const oldPicPath = path.join(process.cwd(), 'public', user.profilePic);
    if (fs.existsSync(oldPicPath)) {
      fs.unlinkSync(oldPicPath);
    }

    // Update user profile pic in database to null
    const updatedUser = await storage.deleteUserProfilePic(req.user.id);
    
    res.json({
      success: true,
      message: 'Profile picture deleted successfully'
    });
  } catch (error) {
    console.error('Profile pic delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}