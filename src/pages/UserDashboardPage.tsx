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
  name: string;
  description: string;
}

const UserDashboardPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const [bookingsResponse, workspacesResponse] = await Promise.all([
          axios.get('http://localhost:5003/api/bookings/my', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5002/api/workspaces'),
        ]);

        setBookings(bookingsResponse.data);
        setWorkspaces(workspacesResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
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
              <strong>{b.workspaceName}</strong> — {new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-bold mb-4">Доступные рабочие места</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : workspaces.length === 0 ? (
        <p>Нет доступных мест.</p>
      ) : (
        <ul className="space-y-2">
          {workspaces.map((ws) => (
            <li key={ws.id} className="border p-3 rounded shadow">
              <strong>{ws.name}</strong>
              <p>{ws.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboardPage;
