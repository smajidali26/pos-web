<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements

- [x] Scaffold the Project

- [x] Customize the Project

- [x] Install Required Extensions

- [x] Compile the Project

- [x] Create and Run Task

- [x] Launch the Project

- [x] Ensure Documentation is Complete

## Project Information
This is a React POS (Point of Sale) Web Application built with modern technologies:

### Tech Stack
- **Frontend**: React 19 with Vite 7.1.3
- **State Management**: Redux Toolkit 2.8.2 with React Redux 9.2.0
- **Styling**: Bootstrap 5.3.7 with Bootstrap Icons 1.13.1
- **HTTP Client**: Axios for API communication
- **Authentication**: JWT-based authentication with API integration
- **Build Tool**: Vite for fast development and optimized production builds

### Features
- User authentication with login/logout functionality
- Shopping cart management with Redux state
- Product catalog with search and filtering
- Shared layout with consistent header and footer
- Responsive design with Bootstrap components
- Modern React hooks and component patterns

### Development
- Development server: `npm run dev` (http://localhost:5173)
- Production build: `npm run build`
- Environment configuration: Copy `.env.example` to `.env` and configure API URL
- Authentication API endpoint: Configurable via `VITE_API_BASE_URL` (default: http://localhost:9090/api/auth/login)
