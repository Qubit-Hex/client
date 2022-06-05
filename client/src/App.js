
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router'
import { Table }  from './components/table';
import { Home } from './components/home';
import { Charts } from './components/charts';
import { Geo } from './components/geo';

function App() {
  return (
    <Routes>
      <Route path="/charts/" element={<Charts />} />
      <Route path='/tables/' element={<Table /> } />
      <Route path='/geo/' element={ <Geo /> } />
      <Route path="/" element={<Home />} />
    </Routes>

  );
}

export default App;
