import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProductRegistry from './pages/ProductRegistry';
import SupplyChain from './pages/SupplyChain';
import BatchManagement from './pages/BatchManagement';
import ETIMs from './pages/ETIMs';
import Prescriptions from './pages/Prescriptions';
import EHealth from './pages/EHealth';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter basename="/ppp_pharma_tracking">
      <Routes>
        <Route path="/"              element={<Dashboard />} />
        <Route path="/products"      element={<ProductRegistry />} />
        <Route path="/supply-chain"  element={<SupplyChain />} />
        <Route path="/batches"       element={<BatchManagement />} />
        <Route path="/recalls"       element={<BatchManagement />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/ehealth"       element={<EHealth />} />
        <Route path="/etims"         element={<ETIMs />} />
        <Route path="/reports"       element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}
