# Frequently Asked Questions (FAQ)

Here are some common questions developers or users might have about the Stack Overflow Clone project.

**Q1: I'm having trouble installing dependencies. What should I do?**

- **A:** Ensure you have compatible versions of Node.js and npm (or yarn) installed. Check the `engines` field in `package.json` if it exists, or try with a recent stable LTS version of Node.
- Delete the `node_modules` folder and any `package-lock.json` or `yarn.lock` files in _both_ the `client` and `server` directories.
- Run `npm cache clean --force` or `yarn cache clean`.
- Try installing dependencies again using `npm install` in the `server` directory and `yarn install` (or `npm install`) in the `client` directory.
- Check for any specific error messages during installation and search online for solutions related to those messages.

**Q2: How do I connect the application to my MongoDB database?**

- **A:** You need to configure the database connection string in the `server` directory.
  1.  Create a file named `.env` in the `server/` directory.
  2.  Copy the contents from `server/.env.example`.
  3.  Replace `"your_mongodb_connection_string"` with your actual MongoDB connection URL (e.g., from MongoDB Atlas or your local instance).
  4.  Ensure your MongoDB server is running and accessible from where you are running the backend server.
  5.  Restart the server (`npm start` in the `server` directory) after creating/modifying the `.env` file.

**Q3: Why is Redux used in the frontend client?**

- **A:** Redux is used for managing the application's global state in a predictable way. In an application like a Stack Overflow clone, many components need access to shared data (like user authentication status, list of questions, current user details). Redux provides a central store for this data, making it easier to:
  - Access state from any component without excessive prop drilling.
  - Manage complex state logic.
  - Track state changes over time (useful for debugging).
  - Handle asynchronous operations (like API calls) cleanly using middleware like Redux Thunk.

**Q4: What is the purpose of JWT (JSON Web Tokens) in this project?**

- **A:** JWT is used for securing the application's authentication process.
  1.  When a user logs in or signs up successfully, the server generates a JWT containing some user identification information (like user ID and email) and signs it with a secret key.
  2.  This token is sent back to the client (browser) and stored (typically in local storage).
  3.  For subsequent requests to protected API endpoints (like asking questions, posting answers, voting), the client sends this token in the request header (`Authorization: Bearer <token>`).
  4.  The server receives the request, verifies the token's signature using the secret key, and extracts the user information. This confirms the user's identity without needing to send credentials on every request.
  5.  This allows for stateless authentication on the server.

**Q5: How are user passwords stored securely?**

- **A:** Passwords are not stored in plain text. The backend uses the `bcryptjs` library to hash passwords before storing them in the database.
  - When a user signs up, their chosen password is run through the bcrypt hashing algorithm (which includes salting) to produce a unique, irreversible hash. Only this hash is stored.
  - When a user tries to log in, the password they provide is hashed using the _same_ process, and the resulting hash is compared to the stored hash. If they match, the login is successful.
  - This means even if the database is compromised, the actual passwords are not exposed.

**Q6: I'm getting CORS errors when the client tries to communicate with the server. How do I fix this?**

- **A:** CORS (Cross-Origin Resource Sharing) errors occur when the browser blocks requests from your frontend (e.g., `http://localhost:3000`) to your backend (e.g., `http://localhost:5000`) because they are on different origins.
  - Ensure the `cors` middleware is correctly implemented and used in your `server/index.js` file _before_ your route definitions. The current setup (`app.use(cors());`) should allow requests from any origin for development.
  - Verify that your server is running and listening on the correct port (`5000` by default).
  - Double-check the `baseURL` in your Axios instance in `client/src/api/index.js` to ensure it points to the correct server address and port.
  - Check your browser's developer console for specific CORS error messages, which might provide more clues.

**Q7: Can I contribute or add new features to this project?**

- **A:** Yes! Contributions are welcome. Please refer to the `Contributing` section in the main [README.md](README.md) file for guidelines on how to contribute.

**Q8: How does voting work?**

- **A:** When a logged-in user clicks the upvote or downvote button on a question:
  1.  An API request is sent from the client to the server's `/questions/vote/:id` endpoint, including the question ID, the type of vote ('upVote' or 'downVote'), and the user's JWT token for authentication.
  2.  The `auth` middleware verifies the user's token.
  3.  The `voteQuestion` controller in `server/controllers/Questions.js` handles the logic:
      - It finds the question by ID.
      - It checks if the user has already upvoted or downvoted.
      - It updates the `upVote` or `downVote` arrays in the question document (adding or removing the user's ID). It ensures a user cannot both upvote and downvote the same question simultaneously.
      - It saves the updated question document.
  4.  The client's Redux state is updated (by re-fetching questions or potentially through a specific vote action), causing the UI to reflect the new vote count.
