import React from 'react';
import LandingPage from './components/LandingPage';

function App() {
   console.log('%c[App] Loaded App component', 'color: blue;');

   return (
     <div>
       <h1 style={{textAlign: "center"}}>App Loaded</h1>
       <LandingPage />
     </div>
   );
}

export default App;

