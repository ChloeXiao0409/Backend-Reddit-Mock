# Backend Reddit Mock

A Back-end Reddit clone built with modern web technologies.

## Overview

This project is a simplified Reddit clone that demonstrates full-stack development capabilities including user authentication, posting content, comments, and voting functionality.

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete posts
- Comment on posts
- Upvote/downvote posts and comments
- User profiles
- Responsive design for mobile and desktop

## Technologies Used

### Frontend (Potential)
- React.js
- Redux for state management
- CSS Modules for styling
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Deployment
- Serverless deployment using AWS Lambda and API Gateway
- MongoDB Atlas for cloud database hosting

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Backend-Reddit-Mock.git
cd Backend-Reddit-Mock
```

2. Install dependencies for backend
```bash
# Install backend dependencies
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
PORT=4000
LOG_LEVEL=debug
DB_CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/app
JWT_KEY=secret
```

4. Start the development servers
```bash
# Start backend server
npm run dev
```

## Testing

This project includes unit and integration tests to ensure the reliability of the application.

1. Run tests using the following command:
```bash
npm test
```

2. Testing framework used:
- Jest for unit testing
- Supertest for API endpoint testing

## Usage
After installation, you can access the application at `http://localhost:4000`

- Register a new account or login with existing credentials
- Browse posts on the homepage
- Create new posts
- Interact with posts through comments and votes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user information

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Comments
- `GET /api/posts/:id/comments` - Get all comments for a post
- `POST /api/posts/:id/comments` - Add a comment to a post
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

This project is deployed using AWS services for scalability and reliability.

### Backend Deployment
- **AWS Lambda**: The backend is hosted as serverless functions.
- **API Gateway**: Used to expose the Lambda functions as RESTful API endpoints.
- **MongoDB Atlas**: Cloud-hosted database for storing application data.

### Steps to Deploy
1. **Set up AWS CLI**:
   Ensure you have the AWS CLI installed and configured with your credentials:
   ```bash
   aws configure
   ```

2. **Package and Deploy Lambda Functions**:
   Use the AWS SAM CLI or Serverless Framework to package and deploy the backend:
   ```bash
   sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket <your-s3-bucket-name>
   sam deploy --template-file packaged.yaml --stack-name BackendRedditMock --capabilities CAPABILITY_IAM
   ```

3. **Configure API Gateway**:
   Link the deployed Lambda functions to API Gateway endpoints.

4. **Environment Variables**:
   Ensure the required environment variables (e.g., `DB_CONNECTION_STRING`, `JWT_KEY`) are set in the Lambda function configuration.

5. **Access the Application**:
   Once deployed, the API can be accessed via the API Gateway URL provided after deployment.

### Notes
- Monitor the application using AWS CloudWatch for logs and performance metrics.
- Use MongoDB Atlas dashboard for database management.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
