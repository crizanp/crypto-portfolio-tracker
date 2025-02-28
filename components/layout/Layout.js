import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Pages that don't need the sidebar
  const noSidebarPages = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ];
  
  // Check if the current page should have a sidebar
  const shouldHaveSidebar = isAuthenticated() && !noSidebarPages.includes(router.pathname) && !router.pathname.startsWith('/reset-password');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-grow">
        {shouldHaveSidebar && <Sidebar />}
        
        <main className={`flex-grow ${shouldHaveSidebar ? 'p-6' : 'p-0'}`}>
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;