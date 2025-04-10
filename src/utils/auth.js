export const authService = {
  // Mock user database
  mockUsers: [
    {
      email: "test@example.com",
      password: "test1234",
      name: "Test User",
      themeColor: "#6457f9",
      id: 1
    },
    {
      email: "demo@example.com",
      password: "demo1234",
      name: "Demo User",
      themeColor: "#4CAF50",
      id: 2
    }
  ],

  // LOGIN FUNCTION
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = authService.mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (user) {
          resolve({
            success: true,
            user: {
              email: user.email,
              name: user.name,
              id: user.id,
              themeColor: user.themeColor
            }
          });
        } else {
          resolve({
            success: false,
            message: "Invalid email or password"
          });
        }
      }, 1000);
    });
  },

  // SIGNUP FUNCTION
  signup: async (name, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userExists = authService.mockUsers.some(u => u.email === email);

        if (userExists) {
          resolve({
            success: false,
            message: "Email already exists"
          });
        } else {
          const newUser = {
            email,
            password, // 🔒 Never store plain passwords in real apps
            name,
            themeColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            id: Date.now()
          };

          authService.mockUsers.push(newUser);

          resolve({
            success: true,
            user: {
              email: newUser.email,
              name: newUser.name,
              id: newUser.id,
              themeColor: newUser.themeColor
            }
          });
        }
      }, 1000);
    });
  },

  // LOGOUT FUNCTION
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};
