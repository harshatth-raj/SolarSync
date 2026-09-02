import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  return (
    <nav role="navigation">
      <span>SolarSync</span>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </nav>
  );
}