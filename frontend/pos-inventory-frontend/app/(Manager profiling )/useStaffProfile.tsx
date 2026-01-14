'use client';

import { useEffect, useState } from 'react';
import { baseURL } from '@/app/constant';

export type Staff = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  active: boolean;
};

export function useStaffProfile() {
  const [user, setUser] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const savedUser = localStorage.getItem('user');

        if (!savedUser) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const { id } = JSON.parse(savedUser);

        const res = await fetch(`${baseURL}/staff/${id}`);

        if (!res.ok) {
          throw new Error('Staff not found');
        }

        const me: Staff = await res.json();

        if (!cancelled) {
          setUser(me.active ? me : null);
        }
      } catch (err) {
        console.error('Profile load failed', err);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
