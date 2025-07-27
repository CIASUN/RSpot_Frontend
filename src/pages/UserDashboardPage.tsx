console.log('UserDashboardPage loaded');
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

const fetchData = async () => {
  try {
    const workspacesResponse = await axios.get('http://localhost:5002/api/Place/workspaces');
    console.log('Ответ от сервера:', workspacesResponse.data);
    setWorkspaces(workspacesResponse.data);
  } catch (error) {
    console.error('Ошибка при получении рабочих мест:', error);
  }

  try {
	  console.log('JWT token:', token);
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
              <strong>{ws.title}</strong> —{' '}
              <span className="text-sm text-gray-600">{ws.view}</span>
              {ws.description && <p>{ws.description}</p>}
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
