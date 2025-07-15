import React from "react";
import { AuthProvider } from "./component/AuthContext.jsx"; 
import AppRoutes from "./component/AppRoutes.jsx" 

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
