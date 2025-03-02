import { atomWithStorage } from 'jotai/utils'
import { Session } from '@/types/auth';

export const sessionAtom = atomWithStorage<Session>(
    'authUser',
    { token: null, user: null, login_at: null },
    undefined, // Default storage (localStorage)
    { getOnInit: true } // Ensures the stored value is retrieved on init
  );