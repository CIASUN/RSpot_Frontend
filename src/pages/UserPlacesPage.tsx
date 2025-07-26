import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Workspace = {
  id: string;
  name: string;
  description: string;
  organizationId: string;
};

const UserPlacesPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5002/api/workspaces')
      .then(response => {
        setWorkspaces(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке рабочих мест:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Доступные рабочие места</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : workspaces.length === 0 ? (
        <p>Нет доступных рабочих мест.</p>
      ) : (
        <ul className="space-y-2">
          {workspaces.map(ws => (
            <li key={ws.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{ws.name}</h3>
              <p>{ws.description}</p>
              <small>Организация: {ws.organizationId}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPlacesPage;
