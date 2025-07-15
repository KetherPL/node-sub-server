# Kether.pl Sub Server (Node.js)

This project is a Node.js-based server designed to support the Kether.pl Left 4 Dead 2 (L4D2) server, with sub-posting role.

This is a partial continuation of the legacy [NodeJS-based Kether.pl-Website-Server](https://github.com/KetherPL/Kether.pl-website-server/tree/nodejs) project codebase, keeping just the '!sub' functionality. The rest of the functionality (except Game Stats, which got abandoned) has been moved to the [Rust port](https://github.com/KetherPL/Kether.pl-website-server/tree/rust).

## Key Features

*   **Steam Bot Integration:** The server includes a Steam bot that can log in to a Steam account and send messages to the selected Steam chat group channel.
*   **LiveServer Call for Subs:** The core functionality involves fetching and processing "call for sub" requests from a live L4D2 server (requires a [dedicated SourceMod plugin](https://github.com/Krevik/Kether.pl-L4D2-Server/blob/kether_2.0/addons/sourcemod/scripting/kether/l4d2_call_for_sub_rest.sp))
*   **REST API Endpoint:** Provides a simple REST endpoint for the L4D2 game server to retrieve JSON SteamID64 (via POST method data) and send Call For Sub requests.
*   **Steam API Integration:** It uses the Steam API to fetch player information, such as player names, based on SteamIDs.
*   **Error Logging:** The server includes robust error logging to help with debugging and monitoring.

## Technologies Used

*   Node.js
*   Express.js
*   Steam-User (Node.js Steam library)
*   Axios (HTTP client)
*   TypeScript

## Setup

1.  **Update/Download Dependencies:**
    ```bash
    npm up
    ```
2.  **Configuration:**
    *   Take a look at a `.sub.auth.ts` file in the root directory.
    *   Populate it with your Steam API key, and Steam bot's account credentials.
3.  **Run the Server:**
    ```bash
    npm run start
    ```
    and

    ```bash
    npm run server
    ```

## Project Structure

*   `.sub.auth.ts`: Sensitive credentials (not committed to version control).
*   `src/`: Contains the main source code.
    *   `api/`: API-related code.
        *   `liveserver/`: Code related to the live server.
    *   `steam/`: Steam bot logic.
    *   `utils/`: Utility functions (logging, fetching, etc.).
    *   `index.ts`: The main entry point of the server.

## License

MIT
