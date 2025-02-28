import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold mb-6">Crypto Portfolio Tracker</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Track all your cryptocurrency investments in one place. Get real-time updates, portfolio analytics, and insights to make smarter investment decisions.
          </p>
          
          <div className="flex gap-4 mb-12">
            <Button onClick={() => router.push('/register')} primary>
              Get Started
            </Button>
            <Button onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Track Your Assets</h3>
                <p>Monitor your crypto holdings across multiple wallets and exchanges in real-time.</p>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Portfolio Analytics</h3>
                <p>Get detailed insights with performance metrics, profit/loss calculations, and historical data.</p>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                <p>Your data is encrypted and stored securely. We never access your private keys.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}