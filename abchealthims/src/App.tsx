import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Admin/Users';
import Patients from './pages/Patients/Patients';
import Diagnosis from './pages/Diagnosis';
import Tasks from './pages/Tasks';
import Images from './pages/Images';
import Invoices from './pages/Invoices';
import Profile from './pages/Profile';
import ImageDetails from './pages/ImageDetails';
import DiagnosisDetails from './pages/DiagnosisDetails';
import NewDiagnosis from './pages/NewDiagnosis';
import EditDiagnosis from './pages/EditDiagnosis';
import ChangePassword from './pages/ChangePassword';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="patients" element={<Patients />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="images" element={<Images />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="profile" element={<Profile />} />
          <Route path="images/:id" element={<ImageDetails />} />
          <Route path="diagnosis/:id" element={<DiagnosisDetails />} />
          <Route path="diagnosis/new" element={<NewDiagnosis />} />
          <Route path="diagnosis/:id/edit" element={<EditDiagnosis />} />
          <Route path="change-password" element={<ChangePassword/>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;