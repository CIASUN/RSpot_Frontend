import React, { useEffect, useState } from 'react';
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

      <ul className="space-y-4">
        {workspaces.map((ws) => (
          <li key={ws.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{ws.title}</p>
              <p className="text-sm text-gray-600">{ws.view}</p>
              <p className="text-sm">Вместимость: {ws.capacity}, Этаж: {ws.floor}</p>
              {ws.description && <p className="text-sm italic">{ws.description}</p>}
            </div>
            <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
