# Stack Overflow Clone System Architecture

This document outlines the architecture, folder structure, major components, data flow, and key design decisions for the Stack Overflow Clone project.

## 1. System Architecture

This project follows a classic **Client-Server architecture** built primarily using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).

- **Client (Frontend):** A Single Page Application (SPA) built with React.js. It handles user interface rendering, user interactions, and communication with the backend server via HTTP requests (using Axios). State management is handled by Redux.
- **Server (Backend):** A RESTful API built with Node.js and Express.js. It handles business logic, interacts with the database, manages user authentication, and serves data to the client.
- **Database:** MongoDB, a NoSQL document database, is used to store application data such as users, questions, and answers. Mongoose acts as the Object Data Modeler (ODM) to interact with MongoDB.

```mermaid
graph TD
    %% === Node Definitions ===
    subgraph "USER BROWSER"
        User("(User)")
        ReactClient{"React SPA Client<br>UI Components<br>React Router<br>Redux Store for State"}
        Axios["Axios Interceptor<br>Attaches JWT to requests"]
    end

    subgraph "BACKEND SERVER (Node js)"
        ExpressServer{"Express App<br>index js"}
        AuthMiddleware["Auth Middleware<br>Verifies JWT"]
        ApiRoutes["API Routes<br>/user, /questions, /answer"]
        Controllers["Controllers<br>Business Logic"]
        Mongoose["Mongoose<br>Data Models"]
    end

    subgraph "DATABASE"
        MongoDB[("MongoDB Database<br>Collections: User, Question")]
    end

    %% === Connections and Flows ===

    %% User interacts with the client
    User -- "Interacts with UI" --> ReactClient

    %% Client State Management
    ReactClient -- "Dispatches Actions" --> ReactClient

    %% --- Flow 1: User Login ---
    ReactClient -- "1- login action sends POST<br>request with user credentials" --> Axios
    Axios -- "2- Forwards request to /user/login" --> ExpressServer
    ExpressServer -- "3- Matches route" --> ApiRoutes
    ApiRoutes -- "4- Calls login controller" --> Controllers
    Controllers -- "5- Validates credentials vs DB" --> Mongoose
    Mongoose -- "6- Reads user data" --> MongoDB
    Controllers -- "7- Creates JWT token" --> Controllers
    Controllers -- "8- Sends response with<br>User Profile and JWT" --> ReactClient
    ReactClient -- "9- Reducer saves JWT to localStorage<br>and updates state" --> ReactClient

    %% --- Flow 2: Authenticated API Call (e g , Post a Question) ---
    ReactClient -- "A- askQuestion action sends POST<br>request with question data" --> Axios
    Axios -- "B- INTERCEPTS: Reads JWT from localStorage<br>and adds Authorization header" --> ExpressServer
    ExpressServer -- "C- Hits protected route /questions/Ask" --> AuthMiddleware
    AuthMiddleware -- "D- VERIFIES JWT If valid, adds<br>userId to request and calls next" --> ApiRoutes
    ApiRoutes -- "E- Calls AskQuestion controller" --> Controllers
    Controllers -- "F- Uses userId and request data<br>to create new question document" --> Mongoose
    Mongoose -- "G- Writes to DB" --> MongoDB
    Controllers -- "H- Sends success response" --> ReactClient

    %% === Styling ===
    style User fill:#e3f2fd,stroke:#333
    style ReactClient fill:#f0f0f0,stroke:#333
    style Axios fill:#fefce8,stroke:#a16207
    style ExpressServer fill:#f3e8ff,stroke:#581c87
    style AuthMiddleware fill:#fee2e2,stroke:#b91c1c
    style Mongoose fill:#dcfce7,stroke:#166534
    style MongoDB fill:#dcfce7,stroke:#166534

+-----------------+      HTTP/S (REST API)     +-----------------+      Mongoose      +-------------+
|  Client         |<------------------------->|  Server         |<----------------->|  Database   |
|  (React, Redux) |                            |  (Node, Express)|                    |  (MongoDB)  |
|  - UI           |      (Axios Requests)      |  - API Endpoints|                    |  - Users    |
|  - State Mgmt   |                            |  - Controllers  |                    |  - Questions|
|  - Routing      |      (JSON Responses)      |  - Middleware   |                    |  - Answers  |
|  - API Calls    |                            |  - Models       |                    |  (embedded) |
+-----------------+                            +-----------------+                    +-------------+
```

## 2. Project Folder Structure

The project is organized into two main directories: `client` and `server`.

```
stack-overflow-kartikey/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets and index.html
│   ├── src/                    # React source code
│   │   ├── actions/            # Redux actions (auth, questions, users, etc.)
│   │   ├── api/                # Axios instance and API request functions
│   │   ├── assets/             # Static assets like images, svgs
│   │   ├── components/         # Reusable UI components (Navbar, Sidebars, Avatar, etc.)
│   │   ├── pages/              # Page-level components (Home, Auth, Questions, AskQuestion, etc.)
│   │   ├── reducers/           # Redux reducers
│   │   ├── AllRoutes.jsx       # Main application routing setup
│   │   ├── App.js              # Root application component
│   │   ├── App.css             # Global styles
│   │   ├── index.js            # Entry point, Redux store setup
│   │   └── index.css           # Base CSS
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── ... (config files, lock files)
│
└── server/                     # Node.js/Express Backend API
    ├── controllers/            # Request handling logic (auth, questions, answers, users)
    ├── middlewares/            # Custom middleware (e.g., auth for JWT verification)
    ├── models/                 # Mongoose schemas and models (User, Question)
    ├── routes/                 # API route definitions (users, questions, answers)
    ├── .env.example            # Example environment variables
    ├── .gitignore
    ├── index.js                # Server entry point, Express app setup, DB connection
    ├── package.json
    ├── Procfile                # For deployment (e.g., Heroku)
    └── ... (lock files)
```

## 3. Major Components

**Client:**

- **React Components:** Structured into `components` (reusable) and `pages` (route-specific views).
  - `Navbar`: Top navigation bar with logo, links, search, auth buttons/avatar.
  - `LeftSidebar`: Navigation for Home, Questions, Tags, Users.
  - `RightSidebar`: Widgets for blog posts, meta links, watched tags.
  - `HomeMainbar`: Displays the list of questions on the homepage/questions page.
  - `QuestionList`/`Questions`: Renders individual question summaries.
  - `QuestionsDetails`: Displays full question, answers, and allows posting answers/voting.
  - `AskQuestion`: Form for submitting new questions.
  - `Auth`: Handles Login and Signup forms.
  - `UserProfile`: Displays and allows editing of user profiles.
  - `Users`: Displays a list of all users.
  - `Tags`: Displays tag information.
  - `Avatar`: Reusable component for user avatars.
- **Redux Store:**
  - `actions`: Define action creators that initiate state changes (often involving API calls via Redux Thunk).
  - `reducers`: Handle state updates based on dispatched actions. Combined using `combineReducers`.
  - `store`: Created in `index.js`, applying middleware (Thunk).
- **React Router (`AllRoutes.jsx`):** Manages client-side navigation between different pages/views.
- **Axios API Client (`api/index.js`):** Centralized setup for making requests to the backend API. Includes an interceptor to automatically add the JWT token to authorized requests.

**Server:**

- **Express App (`index.js`):** Initializes the Express application, connects to MongoDB, applies middleware (CORS, JSON body parser), and mounts route handlers.
- **Routes (`routes/`):** Define the API endpoints (e.g., `/user/login`, `/questions/Ask`, `/answer/post/:id`) and map them to controller functions.
- **Controllers (`controllers/`):** Contain the core logic for handling requests, interacting with models, and sending responses. Separates business logic from routing definitions.
- **Models (`models/`):** Define Mongoose schemas (`userSchema`, `QuestionSchema`) that represent the structure of data in the MongoDB collections. Provide methods for database operations (CRUD).
- **Middleware (`middlewares/auth.js`):** Functions that execute during the request-response cycle. The `auth` middleware verifies the JWT token for protected routes.
- **MongoDB Database:** Stores the application data persistently.

## 4. Data Flow Examples

**1. User Login:**

1.  **Client (Auth Page):** User enters email/password and clicks "Log in".
2.  **Client (Component):** `handleSubmit` function is triggered.
3.  **Client (Action):** `login` action creator (`actions/auth.js`) is dispatched with auth data.
4.  **Client (API):** Axios sends a POST request to `/user/login` with email/password in the body.
5.  **Server (Route):** `/user/login` route (`routes/users.js`) matches the request.
6.  **Server (Controller):** `login` controller (`controllers/auth.js`) is executed.
7.  **Server (Model):** Controller finds the user by email in the DB using the `User` model.
8.  **Server (Logic):** Compares the provided password with the stored hash using `bcrypt.compare`.
9.  **Server (JWT):** If credentials are valid, generates a JWT containing user ID/email, signed with `JWT_SECRET`.
10. **Server (Response):** Sends a 200 OK response with user data and the generated token.
11. **Client (API):** Axios receives the response.
12. **Client (Action):** The Redux Thunk action receives the data.
13. **Client (Reducer):** Dispatches an `AUTH` action type; `authReducer` updates the state and stores the profile (including token) in Local Storage. `currentUserReducer` might also be updated.
14. **Client (UI):** Components re-render based on the updated Redux state (e.g., Navbar shows avatar/logout button).

**2. Fetching All Questions:**

1.  **Client (App.js/Home Page Mount):** `useEffect` hook dispatches `fetchAllQuestions` action on initial load.
2.  **Client (Action):** `fetchAllQuestions` action creator (`actions/question.js`) is called.
3.  **Client (API):** Axios sends a GET request to `/questions/get`.
4.  **Server (Route):** `/questions/get` route (`routes/Questions.js`) matches.
5.  **Server (Controller):** `getAllQuestions` controller (`controllers/Questions.js`) is executed.
6.  **Server (Model):** Controller fetches all documents from the `questions` collection using the `Question` model.
7.  **Server (Response):** Sends a 200 OK response with the list of questions.
8.  **Client (API):** Axios receives the response.
9.  **Client (Action):** Redux Thunk action receives the data.
10. **Client (Reducer):** Dispatches `FETCH_ALL_QUESTIONS`; `questionsReducer` updates the `data` property in its state slice with the fetched questions.
11. **Client (UI):** Components connected to the `questionsReducer` state (e.g., `HomeMainbar`) re-render, displaying the list of questions.

**3. Asking a Question (Protected Route):**

1.  **Client (AskQuestion Page):** Logged-in user fills the form and submits.
2.  **Client (Component):** `handleSubmit` triggers dispatch of `askQuestion` action.
3.  **Client (Action):** `askQuestion` action creator (`actions/question.js`) gets question data and user info.
4.  **Client (API Interceptor):** Axios interceptor (`api/index.js`) reads the token from Local Storage and adds it to the `Authorization` header.
5.  **Client (API):** Axios sends a POST request to `/questions/Ask` with question data and the token in the header.
6.  **Server (Route):** `/questions/Ask` route (`routes/Questions.js`) matches.
7.  **Server (Middleware):** `auth` middleware (`middlewares/auth.js`) executes first. It verifies the JWT token from the header. If valid, it extracts `userId` and adds it to the `req` object, then calls `next()`. If invalid, it stops the request.
8.  **Server (Controller):** `AskQuestion` controller (`controllers/Questions.js`) executes (only if middleware passed).
9.  **Server (Model):** Controller creates a new `Question` document using the model, including the `userId` from the `req` object.
10. **Server (DB):** Saves the new question document to MongoDB.
11. **Server (Response):** Sends a 200 OK response indicating success.
12. **Client (API):** Axios receives the response.
13. **Client (Action):** Redux Thunk action may dispatch `fetchAllQuestions` again to update the list and navigates the user (e.g., to the homepage).
14. **Client (UI):** User is redirected, potentially sees their new question.

## 5. Design Decisions

- **MERN Stack:** Chosen for its popularity, use of JavaScript across the entire stack (simplifying development), large community support, and suitability for building dynamic web applications.
- **React for Frontend:** A powerful library for building component-based, interactive user interfaces. Its virtual DOM offers efficient rendering.
- **Redux for State Management:** Provides a predictable state container for managing complex application state shared across many components (auth status, questions, user data). Essential for larger SPAs.
- **Express.js for Backend:** A minimal and flexible Node.js framework, making it easy to build robust APIs quickly. Wide range of available middleware.
- **MongoDB:** A flexible NoSQL database suitable for evolving schemas. Document-based storage aligns well with JavaScript objects. Mongoose provides structure and validation.
- **JWT for Authentication:** Stateless authentication mechanism suitable for APIs. Avoids the need for server-side sessions, improving scalability.
- **Separate Client/Server:** Clear separation of concerns between frontend and backend logic. Allows independent development, deployment, and scaling of the client and server.
- **RESTful API:** Standard approach for client-server communication over HTTP, using standard methods (GET, POST, PATCH, DELETE) and status codes.
- **Middleware (`auth.js`):** Used effectively to protect server routes, ensuring only authenticated users can perform certain actions. Promotes DRY (Don't Repeat Yourself) principle for authentication checks.
- **Embedding Answers:** Answers are embedded within the `Question` model. This simplifies fetching a question and all its answers in a single query. For extremely high numbers of answers per question, a separate `Answer` collection with references might be considered, but embedding is often sufficient and simpler initially.
