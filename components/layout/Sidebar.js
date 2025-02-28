import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiHome, 
  FiPieChart, 
  FiDollarSign, 
  FiSettings, 
  FiPlus,
  FiTrendingUp,
  FiBarChart2,
  FiRefreshCw
} from 'react-icons/fi';

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { path: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: '/portfolio', icon: <FiPieChart size={20} />, label: 'Portfolio' },
    { path: '/portfolio/add', icon: <FiPlus size={20} />, label: 'Add Asset' },
    { path: '/portfolio/performance', icon: <FiTrendingUp size={20} />, label: 'Performance' },
    { path: '/portfolio/analytics', icon: <FiBarChart2 size={20} />, label: 'Analytics' },
    { path: '/portfolio/transactions', icon: <FiDollarSign size={20} />, label: 'Transactions' },
    { path: '/portfolio/sync', icon: <FiRefreshCw size={20} />, label: 'Sync Data' },
    { path: '/settings', icon: <FiSettings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">CryptoTracker</h2>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-md transition duration-200 ${
                  router.pathname === item.path 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-8">
        <div className="bg-gray-700 p-4 rounded-md">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-sm text-gray-300 mb-3">
            Check our documentation for help with using CryptoTracker.
          </p>
          <a 
            href="#" 
            className="inline-block text-sm text-blue-400 hover:text-blue-300"
          >
            View Documentation →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;