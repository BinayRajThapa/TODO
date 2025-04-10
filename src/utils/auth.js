export const authService = {
  
  mockUsers: [
    {
      email: "test@example.com",
      password: "test1234",
      name: "Test User",
      themeColor: "#6457f9" 
    },
    {
      email: "demo@example.com",
      password: "demo1234",
      name: "Demo User",
      themeColor: "#4CAF50" 
    }
  ],

  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {

        const user = authService.mockUsers.find(u => 
          u.email === email && u.password === password
        );

        if (user) {
          resolve({
            success: true,
            user: { email: user.email, name: user.name }
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

  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};