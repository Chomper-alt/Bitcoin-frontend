// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Support from "./pages/Support";
import Review from "./pages/Review";
import Terms from "./pages/terms";

import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

import DashboardLayout from "./pages/DashboardLayout";
import Profile from "./dashboard/UserProfile";
import VIP from "./dashboard/VipDashboard";
import Wallet from "./dashboard/Wallet";
import Transactions from "./dashboard/Transactions";
import Referrals from "./dashboard/Referrals";
import Settings from "./dashboard/Settings";
import Trade from "./dashboard/Trade";
import DemoTrade from "./dashboard/trade/DemoTrade";
import LiveTrade from "./dashboard/trade/LiveTrade";
import CopyTrade from "./dashboard/trade/CopyTrade";
import RequestSignalCode from "./pages/RequestSignalCode";

import WalletHistory from "./pages/WalletHistory";
import Deposit from "./dashboard/Deposit";
import Withdraw from "./dashboard/Withdraw";
import VerifyPhone from "./pages/VerifyPhone";

import Admin from "./pages/Admin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import AdminMod from "./admin/AdminWalletMod";
import ManageTransactions from "./admin/ManageTransactions";
import ManageTickets from "./admin/ManageTickets";
import AdminSignals from "./admin/AdminSignals";
import AdminSignalRequests from "./admin/AdminSignalRequest";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user, loading } = useUser();

  // 🔥 CRITICAL: Do NOT render ANY route until user is restored
  if (loading) return <div>Loading...</div>;

  // Helpers
  const RequireUser = ({ children }) =>
    user ? children : <Navigate to="/login" />;

  const RequireAdmin = ({ children }) =>
    user?.isAdmin ? children : <Navigate to="/dashboard" />;

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/review" element={<Review />} />
        <Route path="/terms" element={<Terms />} />

        {/* AUTH ROUTES */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard/profile" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard/profile" />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard/*"
          element={
            <RequireUser>
              <DashboardLayout />
            </RequireUser>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="vip" element={<VIP />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="settings" element={<Settings />} />
          <Route path="trade" element={<Trade />} />
          <Route path="trade/demo" element={<DemoTrade />} />
          <Route path="trade/live" element={<LiveTrade />} />
          <Route path="trade/copy" element={<CopyTrade />} />
          <Route path="request-signal" element={<RequestSignalCode />} />
        </Route>

        {/* DIRECT WALLET ROUTES */}
        <Route
          path="/wallet"
          element={
            <RequireUser>
              <Wallet />
            </RequireUser>
          }
        />
        <Route
          path="/wallet/deposit"
          element={
            <RequireUser>
              <Deposit />
            </RequireUser>
          }
        />
        <Route
          path="/wallet/withdraw"
          element={
            <RequireUser>
              <Withdraw />
            </RequireUser>
          }
        />
        <Route
          path="/wallet-history"
          element={
            <RequireUser>
              <WalletHistory />
            </RequireUser>
          }
        />

        {/* VERIFICATION */}
        <Route path="/verify-phone/:token" element={<VerifyPhone />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="mod" element={<AdminMod />} />
          <Route path="transactions" element={<ManageTransactions />} />
          <Route path="tickets" element={<ManageTickets />} />
          <Route path="signals" element={<AdminSignals />} />
          <Route path="signal-requests" element={<AdminSignalRequests />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
