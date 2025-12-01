import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Bitcoin App</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/transactions" className="hover:underline">Trades</Link>
        <Link to="/wallet-history" className="hover:underline">Wallet</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        <Link to="/login" className="hover:underline text-red-400">Logout</Link>
      </div>
    </nav>
  );
}
