import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-brand-beige">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-peach/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-orange/10 blur-[120px]" />
      </div>

      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
          <Header title={title} />
          <div className="flex-1 mt-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
