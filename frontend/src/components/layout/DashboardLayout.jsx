import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from '../chatbot/Chatbot';

const DashboardLayout = ({ children, title, evidenceData }) => {
  return (
    <div className="flex h-screen print:h-auto w-full relative overflow-hidden print:overflow-visible transition-colors duration-500">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0 print:hidden overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent)]/20 blur-[120px] transition-colors duration-500" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] transition-colors duration-500" />
      </div>

      <div className="print:hidden relative z-10">
        <Sidebar />
      </div>
      
      <main className="flex-1 flex flex-col h-full print:h-auto overflow-y-auto print:overflow-visible overflow-x-hidden relative z-10 px-6 pb-12 print:px-0 print:pb-0">
        <div className="max-w-7xl mx-auto w-full h-full print:h-auto flex flex-col">
          <div className="print:hidden">
            <Header title={title} />
          </div>
          <div className="flex-1 mt-4 print:mt-0">
            {children}
          </div>
        </div>
      </main>
      <Chatbot evidenceData={evidenceData} />
    </div>
  );
};

export default DashboardLayout;
