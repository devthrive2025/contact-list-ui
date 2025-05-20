
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
