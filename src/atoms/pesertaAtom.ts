import { PesertaKediri } from '@/types/kediri';
import { PesertaKertosono } from '@/types/kertosono';
import { atom } from 'jotai';

export const pesertaAtom = atom<PesertaKediri[] | PesertaKertosono[] >([]);
export const selectedPesertaAtom = atom<PesertaKediri[] | PesertaKertosono[]>([]);
export const activePesertaIndexAtom = atom<number>(0)
export const formValuesAtom = atom([]);