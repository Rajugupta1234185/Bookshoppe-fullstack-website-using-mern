import React,{useState} from 'react';
import ReactDOM from 'react-dom/client';
import { FormDataProvider } from './FormDataContext'; // Import the provider
// import Gmailverification from './OTPVerification';
// import Login from './Login';
// import Signup from './Signup';
// import Forgetpassword from './forgetpassword';

// function App() {
//   // State to toggle between login, signup, and forgetpassword
//   const [page, setPage] = useState('login'); // 'login', 'signup', 'forgetpassword'

//   // Function to handle page change
//   const togglePage = (pageName) => {
//     setPage(pageName);
//   };

//   return (
//     <div className="auth-container">
//       {/* Conditionally render Login, Signup or Forgetpassword */}
//       {page === 'login' && (
//         <div className="loginpage">
//           <Login onCreateAccount={() => togglePage('signup')} onforgetfunction={() => togglePage('forgetpassword')} />
//         </div>
//       )}
//       {page === 'signup' && (
//         <div className="signupage">
//           <Signup gotootp={() => togglePage('otpverification')} />
//         </div> 
//       )}
//       {page === 'forgetpassword' && (
//         <div className="forget-page">
//           <Forgetpassword backtohome={() => togglePage('login')} />
//         </div>
//       )}
//       {page === 'otpverification' && (
//         <div className="otppage">
//           <Gmailverification backtologin={() => togglePage('login')} backtoregistration={() => togglePage('signup')} />
//         </div>
//       )}
//     </div>
//   );
// }
import Chatbot from './admin_chatbot';
function App(){
  return(
    <Chatbot/>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FormDataProvider>  {/* Wrap the App with the provider */}
      <App />
    </FormDataProvider>
  </React.StrictMode>
);
