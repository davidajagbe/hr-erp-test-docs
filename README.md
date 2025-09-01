
# HR-ERP Test Docs Backend

This is the backend API for the HR-ERP Test Docs project. It is built with Node.js, Express, TypeScript, MongoDB, and uses Zod for schema validation and OpenAPI documentation.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or bun (choose one)
- MongoDB instance (local or Atlas)

### Installation
1. **Clone the repository:**
	 ```bash
	 git clone https://github.com/davidajagbe/hr-erp-test-docs.git
	 cd hr-erp-test-docs
	 ```

2. **Install dependencies:**
	 - With npm:
		 ```bash
		 npm install
		 ```
	 - Or with yarn:
		 ```bash
		 yarn install
		 ```
	 - Or with bun:
		 ```bash
		 bun install
		 ```

3. **Set up environment variables:**
	 - Copy `.env.example` to `.env` (if available) or create a `.env` file in the root directory.
	 - Set the following variables:
		 ```env
		 PORT=5000
		 MONGO_URI=your_mongodb_connection_string
		 # Add any other required environment variables
		 ```

4. **Start the development server:**
	 - With npm:
		 ```bash
		 npm run dev
		 ```
	 - Or with yarn:
		 ```bash
		 yarn dev
		 ```
	 - Or with bun:
		 ```bash
		 bun run dev
		 ```

## API Documentation
- After starting the server, visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) for interactive Swagger UI and OpenAPI docs.

## Project Structure
- `src/` - Main source code
	- `model/` - Mongoose models
	- `routes/` - Express route handlers
	- `openapi/` - OpenAPI registry and schema definitions
	- `guarantor/` - Guarantor-related logic

## Useful Scripts
- `dev` - Start the server in development mode with hot reload
- `build` - Compile TypeScript to JavaScript
- `start` - Start the compiled server

## Notes for Developers
- Make sure MongoDB is running and accessible via the `MONGO_URI` in your `.env` file.
- All API validation and documentation is handled with Zod and OpenAPI.
- For new endpoints, update the OpenAPI registry in `src/openapi/registry.ts`.
- For questions, check the code comments or contact the repository owner.

---

Happy coding!
