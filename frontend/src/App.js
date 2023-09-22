import "./App.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

const App = () => {
  return (
    <>
      <ChakraProvider>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/chats" exact element={<ChatPage />} />
        </Routes>
      </ChakraProvider>
    </>
  );
};

export default App;
