// Rate limiting
const rateLimits = new Map<string, { attempts: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Mock user database - In a real app, this would be your backend database
const mockUsers = new Map<string, { password: string; name: string; role: string }>();

// Initialize with admin user
mockUsers.set('admin@example.com', { 
  password: 'admin123', 
  name: 'Admin',
  role: 'admin'
});

export const registerUser = (email: string, password: string, name: string): void => {
  if (mockUsers.has(email)) {
    throw new Error('Account already exists');
  }
  mockUsers.set(email, { 
    password, 
    name,
    role: 'user'
  });
};

export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimits.get(identifier);

  if (!userLimit) {
    rateLimits.set(identifier, { attempts: 1, lastAttempt: now });
    return true;
  }

  if (now - userLimit.lastAttempt > RATE_LIMIT_WINDOW) {
    rateLimits.set(identifier, { attempts: 1, lastAttempt: now });
    return true;
  }

  if (userLimit.attempts >= MAX_ATTEMPTS) {
    return false;
  }

  rateLimits.set(identifier, {
    attempts: userLimit.attempts + 1,
    lastAttempt: now,
  });
  return true;
};

// Account validation
export const validateAccount = (email: string): boolean => {
  return mockUsers.has(email);
};

export const validateCredentials = (email: string, password: string): boolean => {
  const user = mockUsers.get(email);
  return user?.password === password;
};

export const getUserRole = (email: string): string => {
  return mockUsers.get(email)?.role || 'user';
};

export const getUserName = (email: string): string => {
  return mockUsers.get(email)?.name || '';
};

// Password validation
export const isPasswordComplex = (password: string): boolean => {
  return password.length >= 8;
};

export const getPasswordRequirements = (): string => {
  return 'Password must be at least 8 characters long';
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 100);
};

// Error sanitization
export const sanitizeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message.replace(/[<>]/g, '');
  }
  return 'An unexpected error occurred';
};

// CSRF Protection
let csrfToken: string | null = null;

export const generateCsrfToken = (): string => {
  const token = crypto.randomUUID();
  csrfToken = token;
  return token;
};

export const validateCsrfToken = (token: string): boolean => {
  return token === csrfToken;
};

// Session validation
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const isSessionValid = (lastActivity: number): boolean => {
  return Date.now() - lastActivity <= SESSION_DURATION;
};

// Permission checking
export const checkPermission = (userRole: string, requiredRole: string): boolean => {
  const roles = ['user', 'admin'];
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  if (userRoleIndex === -1 || requiredRoleIndex === -1) {
    return false;
  }
  
  return userRoleIndex >= requiredRoleIndex;
};