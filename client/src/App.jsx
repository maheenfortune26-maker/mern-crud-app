import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';
import UpdateUser from './components/UpdateUser';

function App() {
  return (
    <div className="app-shell">
      {/* Background grid */}
      <div className="bg-grid" />
      <div className="glow-top" />
      <div className="glow-br" />

      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/"           element={<UserList />} />
          <Route path="/create"     element={<CreateUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
