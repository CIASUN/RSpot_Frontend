import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Workspace {
  id: string;
  title: string;
  view: string;
  capacity: number;
  floor: number;
  hasSocket: boolean;
  isQuietZone: boolean;
  description: string | null;
}

export default function AdminLayout() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/Place/workspaces');
        setWorkspaces(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке рабочих мест:', error);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Управление пространствами (Admin)</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Выйти
        </button>
      </div>

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
                <td className="px-4 py-2 font-medium">{ws.title}</td>
                <td className="px-4 py-2">{ws.view}</td>
                <td className="px-4 py-2">{ws.capacity}</td>
                <td className="px-4 py-2">{ws.floor}</td>
                <td className="px-4 py-2">{ws.hasSocket ? 'Да' : 'Нет'}</td>
                <td className="px-4 py-2">{ws.isQuietZone ? 'Да' : 'Нет'}</td>
                <td className="px-4 py-2 italic text-sm">{ws.description || '-'}</td>
                <td className="px-4 py-2">
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
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
