import React from 'react';
import Navbar from '../global/navbar';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center max-w-full overflow-x-hidden mb-6">
        {children}
      </div>
    </>
  );
}

export default Layout;
