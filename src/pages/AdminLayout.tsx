import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';

interface Workspace {
  id?: string;
  title: string;
  view: string;
  capacity: number;
  floor: number;
  hasSocket: boolean;
  isQuietZone: boolean;
  description?: string;
  organizationId: string;
}

interface Organization {
  id?: string;
  name: string;
  address: string;
}

const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch (err) {
    console.error('Ошибка при декодировании токена:', err);
    return null;
  }
};


const handleDecodeToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Токен не найден в localStorage');
    return;
  }

  try {
    const decoded = jwtDecode(token);
    alert('Декодированный токен:\n' + JSON.stringify(decoded, null, 2));
  } catch (err) {
    console.error('Ошибка при декодировании токена:', err);
    alert('Ошибка при декодировании токена');
  }
};

export default function AdminLayout() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const initialWorkspace = (): Workspace => ({
    id: uuidv4(),
    title: '',
    view: '',
    capacity: 1,
    floor: 1,
    hasSocket: false,
    isQuietZone: false,
    description: '',
    organizationId: ''
  });

  const [newWorkspace, setNewWorkspace] = useState<Workspace>(initialWorkspace());
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

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/place/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке организаций:', error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    fetchOrganizations();
  }, []);

  const handleAddWorkspace = async () => {
    if (!newWorkspace.organizationId) {
      alert('Пожалуйста, выберите организацию.');
      return;
    }
    if (!newWorkspace.title.trim()) {
      alert('Пожалуйста, введите имя рабочего места.');
      return;
    }

    try {
      const payload = {
        ...newWorkspace,
        id: uuidv4(),
		title: newWorkspace.title,
		Organization: null
      };

      await axios.post('http://localhost:5002/api/place/workspaces', payload);
      setNewWorkspace(initialWorkspace());
      fetchWorkspaces();
    } catch (error) {
      console.error('Ошибка при добавлении рабочего места:', error);
      alert('Ошибка при добавлении рабочего места');
    }
  };

  const handleDeleteWorkspace = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:5002/api/place/workspaces/${id}`);
      fetchWorkspaces();
    } catch (error) {
      console.error('Ошибка при удалении рабочего места:', error);
      alert('Ошибка при удалении рабочего места');
    }
  };

const handleAddOrganization = async () => {
  if (!newOrg.name.trim() || !newOrg.address.trim()) {
    alert('Пожалуйста, заполните все поля организации.');
    return;
  }

  const currentUserId = getCurrentUserId();
  if (!currentUserId) {
    alert('Не удалось получить ID текущего пользователя. Возможно, вы не авторизованы.');
    return;
  }

  try {
    await axios.post('http://localhost:5002/api/place/organizations', {
      name: newOrg.name,
      address: newOrg.address,
      ownerUserId: currentUserId,
    });
    setNewOrg({ name: '', address: '' });
    alert('Организация добавлена');
    fetchOrganizations();
  } catch (error) {
    console.error('Ошибка при добавлении организации:', error);
    alert('Ошибка при добавлении организации');
  }
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-4 space-y-8">
<div className="flex justify-between items-center gap-4">
  <h1 className="text-2xl font-bold">Управление пространствами (Admin)</h1>
  <div className="flex gap-2">
    <button
      onClick={handleDecodeToken}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
    >
      Декодировать токен
    </button>
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Выйти
    </button>
  </div>
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

      {/* Добавление нового рабочего места */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Добавить рабочее место</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="org-select">
              Название организации
            </label>
            <select
              id="org-select"
              value={newWorkspace.organizationId}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, organizationId: e.target.value })}
              className="border px-3 py-1 rounded w-full"
            >
              <option value="">-- Выберите организацию --</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>

            <div className="col-span-2 mt-4">
              <label className="block mb-1 font-medium" htmlFor="title-input">
                Имя рабочего места
              </label>
              <input
                id="title-input"
                type="text"
                placeholder="Имя рабочего места"
                value={newWorkspace.title}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, title: e.target.value })}
                className="border px-3 py-1 rounded w-full"
              />
            </div>

            <div className="col-span-2 mt-4">
              <label className="block mb-1 font-medium" htmlFor="location-input">
                Локация
              </label>
              <input
                id="location-input"
                type="text"
                placeholder="Локация"
                value={newWorkspace.view}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, view: e.target.value })}
                className="border px-3 py-1 rounded w-full"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="capacity-input">
              Вместимость
            </label>
            <input
              id="capacity-input"
              type="number"
              min={1}
              placeholder="Вместимость"
              value={newWorkspace.capacity}
              onChange={(e) =>
                setNewWorkspace({ ...newWorkspace, capacity: Math.max(1, Number(e.target.value)) })
              }
              className="border px-3 py-1 rounded w-full"
            />

            <label className="block mb-1 font-medium mt-4" htmlFor="floor-input">
              Этаж
            </label>
            <input
              id="floor-input"
              type="number"
              min={1}
              placeholder="Этаж"
              value={newWorkspace.floor}
              onChange={(e) =>
                setNewWorkspace({ ...newWorkspace, floor: Math.max(1, Number(e.target.value)) })
              }
              className="border px-3 py-1 rounded w-full"
            />

            <div className="flex items-center space-x-2 mt-4">
              <input
                id="hasSocket-checkbox"
                type="checkbox"
                checked={newWorkspace.hasSocket}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, hasSocket: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="hasSocket-checkbox" className="font-medium">
                Розетки
              </label>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <input
                id="isQuietZone-checkbox"
                type="checkbox"
                checked={newWorkspace.isQuietZone}
                onChange={(e) =>
                  setNewWorkspace({ ...newWorkspace, isQuietZone: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="isQuietZone-checkbox" className="font-medium">
                Тихая зона
              </label>
            </div>
          </div>

          <div className="col-span-2 mt-4">
            <label className="block mb-1 font-medium" htmlFor="description-input">
              Описание
            </label>
            <input
              id="description-input"
              type="text"
              placeholder="Описание"
              value={newWorkspace.description}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
              className="border px-3 py-1 rounded w-full"
            />
          </div>

          <div className="col-span-2">
            <button
              onClick={handleAddWorkspace}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mt-4"
            >
              Добавить рабочее место
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1cm' }} />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
			  <th className="text-left px-4 py-2">Организация</th>
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
			    <td className="px-4 py-2">
				  {
					organizations.find((org) => org.id === ws.organizationId)?.name || '—'
				  }
				</td>
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
