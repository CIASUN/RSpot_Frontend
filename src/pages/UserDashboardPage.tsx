import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Booking {
  id: string;
  workspaceId: string;
  startTime: string;
  endTime: string;
  workspace: {
    id: string;
    organizationId: string;
    title: string;
    view: string;
  };
}

interface Workspace {
  id: string;
  title: string;
  view: string;
  description: string | null;
}

const UserDashboardPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<Record<string, { start: string; end: string }>>({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Ошибка при получении бронирований:', error);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/Place/workspaces');
      setWorkspaces(response.data);
    } catch (error) {
      console.error('Ошибка при получении рабочих мест:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchWorkspaces(), fetchBookings()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleBooking = async (workspaceId: string) => {
    const selected = selectedDates[workspaceId];

    if (!selected?.start || !selected?.end) {
      alert('Пожалуйста, выберите дату начала и окончания бронирования.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5003/api/bookings',
        {
          workspaceId,
          startTime: selected.start,
          endTime: selected.end,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('Бронирование успешно!');
      await fetchBookings(); // <-- обновляем бронирования
    } catch (error) {
      console.error('Ошибка при бронировании:', error);
      alert('Не удалось забронировать место.');
    }
  };

  const handleDateChange = (workspaceId: string, type: 'start' | 'end', value: string) => {
    setSelectedDates((prev) => ({
      ...prev,
      [workspaceId]: {
        ...prev[workspaceId],
        [type]: value,
      },
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-4">
      {/* Header with logout */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Личный кабинет</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Выйти
        </button>
      </div>

      {/* Bookings Table */}
      <h3 className="text-xl font-semibold mb-2">Мои бронирования</h3>
      {loading ? (
        <p>Загрузка...</p>
      ) : bookings.length === 0 ? (
        <p>Нет активных броней.</p>
      ) : (
        <table className="table-auto w-full mb-6 border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Рабочее место</th>
              <th className="border px-4 py-2">Локация</th>
              <th className="border px-4 py-2">Начало</th>
              <th className="border px-4 py-2">Окончание</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="border px-4 py-2">{b.workspace?.title}</td>
                <td className="border px-4 py-2">{b.workspace?.view}</td>
                <td className="border px-4 py-2">{new Date(b.startTime).toLocaleString()}</td>
                <td className="border px-4 py-2">{new Date(b.endTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Workspaces Table */}
      <h3 className="text-xl font-semibold mb-2">Доступные рабочие места</h3>
      {loading ? (
        <p>Загрузка...</p>
      ) : workspaces.length === 0 ? (
        <p>Нет доступных мест.</p>
      ) : (
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Название</th>
              <th className="border px-4 py-2">Локация</th>
              <th className="border px-4 py-2">Описание</th>
              <th className="border px-4 py-2">Начало</th>
              <th className="border px-4 py-2">Окончание</th>
              <th className="border px-4 py-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map((ws) => (
              <tr key={ws.id}>
                <td className="border px-4 py-2">{ws.title}</td>
                <td className="border px-4 py-2">{ws.view}</td>
                <td className="border px-4 py-2">{ws.description || '-'}</td>
                <td className="border px-4 py-2">
                  <input
                    type="datetime-local"
                    className="border px-2 py-1 rounded"
                    value={selectedDates[ws.id]?.start || ''}
                    onChange={(e) => handleDateChange(ws.id, 'start', e.target.value)}
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="datetime-local"
                    className="border px-2 py-1 rounded"
                    value={selectedDates[ws.id]?.end || ''}
                    onChange={(e) => handleDateChange(ws.id, 'end', e.target.value)}
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleBooking(ws.id)}
                  >
                    Забронировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboardPage;
