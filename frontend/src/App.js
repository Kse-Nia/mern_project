import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <h1>My App</h1>
      </div>
    </ChakraProvider>
  );
}

export default App;
