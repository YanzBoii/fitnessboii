// Photos de progression : compressées dans le navigateur, stockées en octets dans Firestore
// (forfait Spark, pas de Storage). Lisibles uniquement par leur propriétaire (règles).
import { Bytes, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { LIMITS } from '../domain/constants';
import { fitSize } from '../domain/image';
import { db } from './config';
import { photoDataRef, photoMetaRef } from './repo';

/** Décode via <img> : compatible partout et respecte l'orientation EXIF lors du dessin. */
function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('not-image')); };
    img.src = url;
  });
}

async function encode(img: HTMLImageElement, max: number, quality: number) {
  const { w, h } = fitSize(img.naturalWidth, img.naturalHeight, max);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d')!.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob | null>(res => c.toBlob(res, 'image/jpeg', quality));
  if (!blob) throw new Error('encode');
  return new Uint8Array(await blob.arrayBuffer());
}

/** JPEG ≤ 900 Ko : 720 px q.8, puis repli progressif. Le fichier original n'est jamais envoyé. */
export async function compressToJpeg(file: File): Promise<Uint8Array> {
  if (file.type && !file.type.startsWith('image/')) throw new Error('not-image');
  const img = await loadImage(file);
  for (const [max, q] of [[720, 0.8], [720, 0.6], [560, 0.6], [420, 0.5]] as const) {
    const out = await encode(img, max, q);
    if (out.byteLength <= LIMITS.photoBytes) return out;
  }
  throw new Error('too-large');
}

export async function savePhoto(uid: string, week: string, date: string, jpeg: Uint8Array) {
  const b = writeBatch(db);
  b.set(photoDataRef(uid, week), { type: 'image/jpeg', bytes: Bytes.fromUint8Array(jpeg) });
  b.set(photoMetaRef(uid, week), { week, date, createdAt: serverTimestamp() });
  await b.commit();
}

export async function deletePhoto(uid: string, week: string) {
  const b = writeBatch(db);
  b.delete(photoDataRef(uid, week));
  b.delete(photoMetaRef(uid, week));
  await b.commit();
}

/** URL blob: locale pour afficher la photo (à révoquer par l'appelant). */
export async function loadPhotoUrl(uid: string, week: string): Promise<string | null> {
  const s = await getDoc(photoDataRef(uid, week));
  const bytes = s.exists() ? (s.data().bytes as Bytes | undefined) : undefined;
  if (!bytes) return null;
  return URL.createObjectURL(new Blob([bytes.toUint8Array() as BlobPart], { type: 'image/jpeg' }));
}
