// // src/components/LogoutButton.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch } from '../store/store';
// import { logout } from '../services/authSlice';
// import Button from './common/ButtonComponent';



// export default function LogoutButton() {
//   const [isLoggedOut, setIsLoggedOut] = useState(false);
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (!isLoggedOut) {
//       dispatch(logout());
//       setIsLoggedOut(true);
//     } else {
//       navigate('/login');
//     }
//   };

//   return (
//     <Button 
//       onClick={handleLogout}
//       variant={isLoggedOut ? "primary" : "danger"}
//     >
//       {isLoggedOut ? "Log In" : "Logout"}
//     </Button>
//   );
// }