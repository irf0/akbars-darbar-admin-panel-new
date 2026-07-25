import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '@renderer/firebase/config';

function RequireAuth({ children }: { children: React.JSX.Element }): React.JSX.Element {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  if (user === undefined) return <div className="p-5 text-sm text-gray-400">Loading...</div>;
  if (user === null) return <Navigate to="/login" replace />;

  return children;
}

export default RequireAuth;
