# Stack Overflow Clone (Awesome Kartikey Stack)

This project is a full-stack clone of the popular question-and-answer website, Stack Overflow. It allows users to sign up, log in, ask questions, post answers, vote on questions, view user profiles, and browse questions by tags.

## Features

- **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens) and bcrypt hashing.
- **Ask Questions:** Authenticated users can post new questions with titles, detailed descriptions, and relevant tags.
- **Answer Questions:** Users can provide answers to existing questions.
- **Vote on Questions:** Users can upvote or downvote questions.
- **View Questions:** Browse all questions, view individual question details along with their answers.
- **User Profiles:** View user profiles, including join date, posted questions/answers (implicitly), and watched tags. Edit profile functionality.
- **Tags:** Browse questions based on tags. View dedicated tag pages with descriptions.
- **View Users:** See a list of all registered users.
- **Responsive Design:** Basic responsiveness considered for different screen sizes.

## Tech Stack

**Client (Frontend):**

- React.js
- React Router DOM (for routing)
- Redux (for state management)
- Redux Thunk (for asynchronous actions)
- Axios (for API requests)
- CSS3 (for styling)
- Font Awesome (for icons)
- Moment.js (for date formatting)
- JWT Decode (for decoding JWT tokens on the client)

**Server (Backend):**

- Node.js
- Express.js (web framework)
- MongoDB (NoSQL database)
- Mongoose (ODM for MongoDB)
- JSON Web Token (JWT) (for authentication)
- bcryptjs (for password hashing)
- Cors (for enabling Cross-Origin Resource Sharing)
- dotenv (for environment variables)
- Nodemon (for development auto-restart)

**Database:**

- MongoDB

## Setup Instructions

Follow these steps to set up the project locally:

1.  **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd stack-overflow-kartikey
    ```

2.  **Set Up Backend (Server):**

    - Navigate to the server directory:
      ```bash
      cd server
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file in the `server` directory. Copy the contents from `.env.example` and fill in your specific values:
      ```dotenv
      PORT = 5000 # Or any port you prefer
      CONNECTION_URL = "your_mongodb_connection_string"
      JWT_SECRET = "your_jwt_secret_key" # Choose a strong, unique secret
      ```
      _(Replace `"your_mongodb_connection_string"` and `"your_jwt_secret_key"` with your actual MongoDB connection URL and a secure JWT secret)_
    - Start the server (uses nodemon for auto-reloading during development):
      ```bash
      npm start
      ```
      The server should now be running (typically on `http://localhost:5000`).

3.  **Set Up Frontend (Client):**

    - Navigate to the client directory from the root project folder:
      ```bash
      cd ../client
      ```
    - Install dependencies (using yarn as indicated in the original README, but npm install should also work if package-lock.json is accurate):
      ```bash
      yarn install
      # OR
      # npm install
      ```
    - _(Optional but recommended)_ Check the API base URL in `client/src/api/index.js`. It's currently set to `http://localhost:5000`. Ensure this matches the port your server is running on.

      ```javascript
      // client/src/api/index.js
      import axios from "axios";

      const API = axios.create({ baseURL: "http://localhost:5000" }); // Verify this URL
      // ... rest of the file
      ```

    - Start the client development server:
      ```bash
      yarn start
      # OR
      # npm start
      ```
      The React application should open automatically in your default browser (typically `http://localhost:3000`).

## Usage

1.  Open your browser and navigate to `http://localhost:3000` (or the port your client is running on).
2.  **Sign Up / Log In:** Use the "Log in" button to either log in with existing credentials or sign up for a new account.
3.  **Browse Questions:** View the list of questions on the homepage.
4.  **Ask a Question:** Click the "Ask Question" button (requires login) to post your own question.
5.  **View Details:** Click on a question title to see its details, existing answers, and post your own answer.
6.  **Vote:** Use the up/down arrows on the question details page to vote (requires login).
7.  **Tags:** Navigate to the "Tags" section via the left sidebar to view available tags.
8.  **Users:** Navigate to the "Users" section via the left sidebar to see registered users.
9.  **Profile:** Click on your avatar in the navbar (when logged in) to view and edit your profile.
