This is a simple TypeScript app that receives maze information from a websocket, solves the maze, then sends messages to the socket to move player in the maze according to the solution. The maze is solved with the A* algorithm, and the amount of moves required is reduced by moving diagonally when possible.

Developed in January 2023 as a pre-assignment for [Monad](https://monad.fi/).
