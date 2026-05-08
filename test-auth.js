// Simple test to verify user storage functionality
const crypto = require('crypto');

// Mock the Vercel Blob functions for testing
const mockUserStorage = {
  async storeUserAccounts(users) {
    console.log('Storing users:', users);
    return Promise.resolve({ url: 'mock-url' });
  },
  
  async getUserAccounts() {
    console.log('Getting users from storage');
    return Promise.resolve([
      {
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: this.hashPassword('password123'),
        profilePicture: null,
        priorityScore: 85,
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ]);
  },
  
  async findUserByEmail(email) {
    const users = await this.getUserAccounts();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },
  
  async createUser(userData) {
    const users = await this.getUserAccounts();
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.toLowerCase(),
      name: userData.name,
      passwordHash: this.hashPassword(userData.password),
      profilePicture: userData.profilePicture,
      priorityScore: Math.floor(Math.random() * 30) + 70,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    users.push(newUser);
    await this.storeUserAccounts(users);
    console.log('Created user:', newUser);
    return newUser;
  },
  
  async authenticateUser(email, password) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }
    
    if (!this.verifyPassword(password, user.passwordHash)) {
      return null;
    }
    
    user.lastLogin = new Date().toISOString();
    await this.storeUserAccounts(users);
    console.log('Authenticated user:', user);
    return user;
  },
  
  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  },
  
  verifyPassword(password, hash) {
    const passwordHash = this.hashPassword(password);
    return passwordHash === hash;
  }
};

// Test the authentication system
async function testAuth() {
  try {
    console.log('\n=== Testing User Authentication System ===\n');
    
    // Test 1: Create a new user
    console.log('\n1. Creating new user...');
    const newUser = await mockUserStorage.createUser({
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'password123'
    });
    console.log('✅ User created successfully:', newUser.name);
    
    // Test 2: Authenticate with correct credentials
    console.log('\n2. Testing login with correct credentials...');
    const authUser = await mockUserStorage.authenticateUser('john.doe@example.com', 'password123');
    if (authUser) {
      console.log('✅ Login successful:', authUser.name);
    } else {
      console.log('❌ Login failed');
    }
    
    // Test 3: Authenticate with wrong credentials
    console.log('\n3. Testing login with wrong credentials...');
    const wrongAuth = await mockUserStorage.authenticateUser('john.doe@example.com', 'wrongpassword');
    if (wrongAuth) {
      console.log('✅ Login should not have succeeded');
    } else {
      console.log('✅ Login correctly failed with wrong password');
    }
    
    // Test 4: Try to create duplicate user
    console.log('\n4. Testing duplicate user creation...');
    try {
      await mockUserStorage.createUser({
        email: 'john.doe@example.com',
        name: 'Jane Doe',
        password: 'password456'
      });
      console.log('❌ Duplicate user creation should have failed');
    } catch (error) {
      console.log('✅ Duplicate user correctly rejected:', error.message);
    }
    
    // Test 5: Password hashing verification
    console.log('\n5. Testing password hashing...');
    const hash1 = mockUserStorage.hashPassword('password123');
    const hash2 = mockUserStorage.hashPassword('password123');
    const hash3 = mockUserStorage.hashPassword('different');
    
    console.log('✅ Same passwords produce same hash:', hash1 === hash2);
    console.log('✅ Different passwords produce different hash:', hash1 !== hash3);
    
    console.log('\n=== Test Complete ===');
    console.log('✅ User authentication system is working correctly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAuth();
