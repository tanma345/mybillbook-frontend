import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate} from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return(
    <AuthProvider>
      {loading ?(<Loader />)    
   : (
      <Routes>
        <Route path="/" element= {<Navigate to="/admin"/>} />
         {/* Public Routes */}
         <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | BillBook" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | BillBook" />
              <SignUp />
            </>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="eCommerce Dashboard" />
                  <ECommerce />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Calendar />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Profile />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormElements />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormLayout />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Tables />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Settings />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Chart />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Alerts />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <ProtectedRoute>
                <DefaultLayout>
                  <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Buttons />
                </DefaultLayout>
              </ProtectedRoute>
            </>
          }
        />
      </Routes>
    )
}
  </AuthProvider>
  );
}
export default App;
