import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  return (
    <nav className="navbar" role="navigation">
      <div className="navbar-brand">
        <span className="brand-name">SolarSync</span>
        <small className="brand-tag">Operations Dashboard</small>
      </div>
      <div className="navbar-actions">
        <button className="signout-button" onClick={() => dispatch(logout())}>Sign Out</button>
      </div>
    </nav>
  );
}