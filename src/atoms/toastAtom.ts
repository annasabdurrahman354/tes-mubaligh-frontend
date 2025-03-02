import { atom } from 'jotai';

export const toastAtom = atom<{message: string, visible: boolean, color: string}>({message: '', visible: false, color: "default"});
export const loadingAtom = atom(0);