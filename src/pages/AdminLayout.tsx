import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="p-4">
      <nav className="mb-4 space-x-4">
        <Link to="/admin/places" className="text-blue-600 hover:underline">Управление пространствами (Admin)</Link>
      </nav>
      <Outlet />
    </div>
  );
}
