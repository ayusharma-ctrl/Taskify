# Taskify: 
## A decentralized to-do application (dApp) with Blockchain and AI Agent Integration.

This repository contains both the **frontend** and **backend** for a Todo Application with blockchain integration.

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) extension installed on your browser
- Access to a Polygon testnet (e.g., Polygon PoS Amoy)
- Test POL tokens for the testnet ([Get Free POL](https://faucet.polygon.technology/))

---

## Project Structure

```
root
├── client/         # Next.js
├── backend/        # Node.js and Express.js
└── README.md       # This documentation file
```

---

## How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/ayusharma-ctrl/Taskify.git
cd Taskify
```

### 2. Setup Backend

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install --legacy-peer-deps
    or
    npm install --force
    ```

3. Create a `.env` file in the `backend` directory and configure the following environment variables:

    ```env
    PORT=5000

    MONGO_URI=your_mongodb_connection_string

    FRONTEND_URL=frontend_server_uri

    NODE_ENV=development

    JWT_SECRET=your_jwt_secret

    JWT_COOKIE_EXPIRE=10

    API_URL=https://rpc-amoy.polygon.technology

    PRIVATE_KEY=your_private_key_from_metamask

    CONTRACT_ADDRESS=deployed_contract_address
    ```

4. Start the backend server:

    ```bash
    npm run dev
    ```

   The backend will run at `http://localhost:5000`.

### 3. Setup Frontend

1. Navigate to the `frontend` directory:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` directory and configure the following environment variable:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```

4. Start the frontend development server:

    ```bash
    npm run dev
    ```

   The frontend will run at `http://localhost:3000`.

---

## Usage

1. Open the frontend application in your browser at `http://localhost:3000`.
2. Connect your MetaMask wallet to the Polygon PoS Amoy testnet.
3. Add tasks, retrieve them, and modify their details using the app. All task data will be stored on the blockchain.

---

## Troubleshooting

- **Backend not connecting to MongoDB:** Ensure your `MONGO_URI` in `.env` is correctly set.
- **Frontend not connecting to backend:** Verify the `NEXT_PUBLIC_API_URL` in the frontend `.env` file points to the correct backend URL.
- **Contract not working:** Check if the `CONTRACT_ADDRESS` is correctly set in the backend `.env` file and matches your deployed contract address.

---

## Notes

- For blockchain-related functionalities, make sure you have test POL or MATIC tokens in your wallet.
- Ensure you are on the Polygon Amoy testnet in MetaMask to interact with the smart contract.
- AI Agent Integration is under development

---