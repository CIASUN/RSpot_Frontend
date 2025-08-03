import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Workspace {
  id?: string;
  title: string;
  view: string;
  capacity: number;
  floor: number;
  hasSocket: boolean;
  isQuietZone: boolean;
  description?: string;
}

interface Organization {
  id?: string;
  name: string;
  address: string;
}

export default function AdminLayout() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspace, setNewWorkspace] = useState<Workspace>({
    title: '',
    view: '',
    capacity: 1,
    floor: 1,
    hasSocket: false,
    isQuietZone: false,
    description: '',
  });

  const [newOrg, setNewOrg] = useState<Organization>({ name: '', address: '' });

  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/place/workspaces');
      setWorkspaces(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке рабочих мест:', error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleAddWorkspace = async () => {
    try {
      await axios.post('http://localhost:5002/api/place/workspaces', newWorkspace);
      setNewWorkspace({
        title: '',
        view: '',
        capacity: 1,
        floor: 1,
        hasSocket: false,
        isQuietZone: false,
        description: '',
      });
      fetchWorkspaces();
    } catch (error) {
      console.error('Ошибка при добавлении рабочего места:', error);
    }
  };

  const handleDeleteWorkspace = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:5002/api/place/workspaces/${id}`);
      fetchWorkspaces();
    } catch (error) {
      console.error('Ошибка при удалении рабочего места:', error);
    }
  };

  const handleAddOrganization = async () => {
    try {
      await axios.post('http://localhost:5002/api/place/organizations', newOrg);
      setNewOrg({ name: '', address: '' });
      alert('Организация добавлена');
    } catch (error) {
      console.error('Ошибка при добавлении организации:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление пространствами (Admin)</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Выйти
        </button>
      </div>

      {/* Создание новой организации */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Добавить организацию</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Название"
            value={newOrg.name}
            onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
            className="border px-3 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="Адрес"
            value={newOrg.address}
            onChange={(e) => setNewOrg({ ...newOrg, address: e.target.value })}
            className="border px-3 py-1 rounded w-full"
          />
          <button
            onClick={handleAddOrganization}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Добавить организацию
          </button>
        </div>
      </div>

      {/* Создание нового рабочего места */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Добавить рабочее место</h2>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Название"
            value={newWorkspace.title}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, title: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Локация"
            value={newWorkspace.view}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, view: e.target.value })}
            className="border px-3 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Вместимость"
            value={newWorkspace.capacity}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, capacity: Number(e.target.value) })}
            className="border px-3 py-1 rounded"
          />
          <input
            type="number"
            placeholder="Этаж"
            value={newWorkspace.floor}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, floor: Number(e.target.value) })}
            className="border px-3 py-1 rounded"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newWorkspace.hasSocket}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, hasSocket: e.target.checked })}
              className="mr-2"
            />
            Розетки
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newWorkspace.isQuietZone}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, isQuietZone: e.target.checked })}
              className="mr-2"
            />
            Тихая зона
          </label>
          <input
            type="text"
            placeholder="Описание"
            value={newWorkspace.description}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
            className="border px-3 py-1 rounded col-span-2"
          />
          <button
            onClick={handleAddWorkspace}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded col-span-2"
          >
            Добавить рабочее место
          </button>
        </div>
      </div>

      {/* Таблица всех рабочих мест */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Название</th>
              <th className="text-left px-4 py-2">Локация</th>
              <th className="text-left px-4 py-2">Вместимость</th>
              <th className="text-left px-4 py-2">Этаж</th>
              <th className="text-left px-4 py-2">Розетки</th>
              <th className="text-left px-4 py-2">Тихая зона</th>
              <th className="text-left px-4 py-2">Описание</th>
              <th className="text-left px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map((ws) => (
              <tr key={ws.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{ws.title}</td>
                <td className="px-4 py-2">{ws.view}</td>
                <td className="px-4 py-2">{ws.capacity}</td>
                <td className="px-4 py-2">{ws.floor}</td>
                <td className="px-4 py-2">{ws.hasSocket ? 'Да' : 'Нет'}</td>
                <td className="px-4 py-2">{ws.isQuietZone ? 'Да' : 'Нет'}</td>
                <td className="px-4 py-2 text-sm italic">{ws.description || '-'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteWorkspace(ws.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
