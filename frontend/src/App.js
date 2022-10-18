import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Public from './components/Public'
import DashLayout from './components/DashLayout'

import Login from './features/auth/login.js'
import Welcome from './features/auth/Welcome'
import RecordsList from './features/records/RecordsList'
import UsersList from './features/users/UsersList'

import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'

import EditRecord from './features/records/EditRecord'
import NewRecord from './features/records/NewRecord'

import Prefetch from './features/auth/Prefetch'

import PersistLogin from './features/auth/PersistLogin'

import RequireAuth from './features/auth/RequireAuth'   

import { ROLES } from './config/roles'                  
import useTitle from './hooks/useTitle';

function App() {

  useTitle('Record Management System')

  return (

    <Routes>

      <Route path="/" element={<Layout />}>

        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}> 

            <Route element={<Prefetch />}>               

              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route path="records">
                  <Route index element={<RecordsList />} />
                  <Route path=":id" element={<EditRecord />} />
                  <Route path="new" element={<NewRecord />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

              </Route>

            </Route>

          </Route>
        </Route>

      </Route>

    </Routes>

  );
}


export default App;
