'use client';

import { useEffect, useState } from 'react';
import { baseURL } from '@/app/constant';

type Staff = {
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

    async function load() {
      try {
        const email = localStorage.getItem('staffEmail');

        // No early return that breaks React
        if (!email) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const res = await fetch(`${baseURL}/staff`);
        const staff = await res.json();

        const me = staff.find(
          (s: Staff) => s.email === email && s.active === true
        );

        if (!cancelled) {
          setUser(me || null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
