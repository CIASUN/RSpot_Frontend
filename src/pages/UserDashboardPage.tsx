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
    name: string;
    location: string;
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

  const handleBooking = async (workspaceId: string) => {
    const token = localStorage.getItem('token');
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ваши брони</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Выйти
        </button>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : bookings.length === 0 ? (
        <p>Нет активных броней.</p>
      ) : (
        <ul className="mb-6 space-y-2">
          {bookings.map((b) => (
            <li key={b.id} className="border p-3 rounded shadow">
              <strong>{b.workspace?.name}</strong> — {b.workspace?.location}
              <br />
              {new Date(b.startTime).toLocaleString()} – {new Date(b.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-bold mb-4">Доступные рабочие места</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : Array.isArray(workspaces) && workspaces.length > 0 ? (
        <ul className="space-y-4">
          {workspaces.map((ws) => (
            <li key={ws.id} className="border p-4 rounded shadow">
              <strong>{ws.title}</strong> — <span className="text-sm text-gray-600">{ws.view}</span>
              {ws.description && <p className="text-sm">{ws.description}</p>}

              <div className="mt-2 flex flex-col gap-2">
                <label>
                  Начало:
                  <input
                    type="datetime-local"
                    className="ml-2 border rounded px-2 py-1"
                    value={selectedDates[ws.id]?.start || ''}
                    onChange={(e) => handleDateChange(ws.id, 'start', e.target.value)}
                  />
                </label>

                <label>
                  Конец:
                  <input
                    type="datetime-local"
                    className="ml-2 border rounded px-2 py-1"
                    value={selectedDates[ws.id]?.end || ''}
                    onChange={(e) => handleDateChange(ws.id, 'end', e.target.value)}
                  />
                </label>

                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleBooking(ws.id)}
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
    </div>
  );
};

export default UserDashboardPage;
