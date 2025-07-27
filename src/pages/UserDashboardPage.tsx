import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Booking {
  id: string;
  workspaceName: string;
  startTime: string;
  endTime: string;
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
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const workspacesResponse = await axios.get('http://localhost:5002/api/Place/workspaces');
        setWorkspaces(workspacesResponse.data);
      } catch (error) {
        console.error('Ошибка при получении рабочих мест:', error);
      }

      try {
        const bookingsResponse = await axios.get('http://localhost:5003/api/bookings/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Ошибка при получении бронирований:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookingSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!selectedWorkspace || !startTime || !endTime) return;

    try {
      await axios.post(
        'http://localhost:5003/api/bookings',
        {
          workspaceId: selectedWorkspace.id,
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Бронирование успешно!');
      setSelectedWorkspace(null);
      setStartTime('');
      setEndTime('');
      // Обновим список бронирований
      const bookingsResponse = await axios.get('http://localhost:5003/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error('Ошибка при бронировании:', error);
      alert('Ошибка при бронировании');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ваши брони</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : bookings.length === 0 ? (
        <p>Нет активных броней.</p>
      ) : (
        <ul className="mb-6 space-y-2">
          {bookings.map((b) => (
            <li key={b.id} className="border p-3 rounded shadow">
              <strong>{b.workspaceName}</strong> — {new Date(b.startTime).toLocaleString()} -{' '}
              {new Date(b.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-bold mb-4">Доступные рабочие места</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : Array.isArray(workspaces) && workspaces.length > 0 ? (
        <ul className="space-y-2">
          {workspaces.map((ws) => (
            <li key={ws.id} className="border p-3 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{ws.title}</strong> —{' '}
                  <span className="text-sm text-gray-600">{ws.view}</span>
                  {ws.description && <p>{ws.description}</p>}
                </div>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedWorkspace(ws)}
                >
                  Забронировать
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет доступных мест.</p>
      )}

      {selectedWorkspace && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">
            Бронирование: {selectedWorkspace.title}
          </h3>

          <div className="mb-4">
            <label className="block mb-2">
              Начало:
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Конец:
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
          </div>

          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleBookingSubmit}
            >
              Подтвердить
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setSelectedWorkspace(null)}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
