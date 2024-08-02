import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ChemicalList from './components/ChemicalList';
import GlasswareList from './components/GlasswareList';
import EquipmentList from './components/EquipmentList';
import InfoModal from './components/InfoModal';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <InfoModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chemicals" element={<ChemicalList />} />
          <Route path="/glassware" element={<GlasswareList />} />
          <Route path="/equipment" element={<EquipmentList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
