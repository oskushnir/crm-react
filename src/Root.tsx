import { App } from './App';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientPage } from './pages/PatientPage';

export const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />

          <Route path='home' element={<Navigate to='/' />} />

          <Route path='patients'>
            <Route index element={<PatientsPage />} />
            <Route path=':patientId' element={<PatientPage />} />
          </Route>

          <Route path={'*'} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}