// Tests des règles Firestore contre l'émulateur : `npm run test:rules`.
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Bytes, deleteDoc, doc, getDoc, serverTimestamp, setDoc, setLogLevel, Timestamp, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let env: RulesTestEnvironment;

beforeAll(async () => {
  setLogLevel('error');
  env = await initializeTestEnvironment({
    projectId: 'demo-fitnessboii',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 }
  });
});
afterAll(() => env.cleanup());
beforeEach(() => env.clearFirestore());

const alice = () => env.authenticatedContext('alice', { email: 'alice@test.dev', email_verified: true }).firestore();
const bob = () => env.authenticatedContext('bob', { email: 'bob@test.dev', email_verified: true }).firestore();
const unverified = () => env.authenticatedContext('alice', { email: 'alice@test.dev', email_verified: false }).firestore();
const anon = () => env.unauthenticatedContext().firestore();

const profile = { name: 'Alice', goalType: 'force', level: 'inter', split: 'ppl', bodyWeight: 62.5, height: 168, goal: 4, rest: 90,
  autoTimer: true, remind: false, theme: 'ocean', mode: 'dark', onboarded: true };
const program = { name: 'Push', subtitle: 'Pecs', icon: 'fitness_center', days: [0, 3], order: 0,
  exercises: [{ id: 'dc', name: 'DC', machine: '', group: 'pecs', sets: 4, reps: 8, weight: 80, rest: 120, note: 'siège cran 4' }] };
const log = { date: '2026-10-08', programId: 'push', programName: 'Push', minutes: 52,
  perf: { dc: { w: 80, r: 8, name: 'DC', group: 'pecs' } }, createdAt: Timestamp.now() };
const session = { programId: 'push', startedAt: Date.now(), cur: 0, ex: { dc: { w: 80, r: 8, done: false } } };
const jpeg = (n: number) => Bytes.fromUint8Array(new Uint8Array(n).fill(0xff));

/** Données d'Alice écrites sans passer par les règles. */
async function seedAlice() {
  await env.withSecurityRulesDisabled(async ctx => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'users/alice'), profile);
    await setDoc(doc(db, 'users/alice/programs/push'), program);
    await setDoc(doc(db, 'users/alice/sessionLogs/2026-10-08'), log);
    await setDoc(doc(db, 'users/alice/photoData/2026-10-05'), { type: 'image/jpeg', bytes: jpeg(10) });
  });
}

describe('isolation des utilisateurs', () => {
  it('le propriétaire lit et écrit toutes ses données', async () => {
    const db = alice();
    await assertSucceeds(setDoc(doc(db, 'users/alice'), { ...profile, createdAt: serverTimestamp() }));
    await assertSucceeds(setDoc(doc(db, 'users/alice/programs/push'), program));
    await assertSucceeds(setDoc(doc(db, 'users/alice/sessionLogs/2026-10-08'), log));
    await assertSucceeds(setDoc(doc(db, 'users/alice/session/current'), session));
    await assertSucceeds(setDoc(doc(db, 'users/alice/photos/2026-10-05'), { week: '2026-10-05', date: '2026-10-08', createdAt: serverTimestamp() }));
    await assertSucceeds(setDoc(doc(db, 'users/alice/photoData/2026-10-05'), { type: 'image/jpeg', bytes: jpeg(500_000) }));
    await assertSucceeds(getDoc(doc(db, 'users/alice/photoData/2026-10-05')));
    await assertSucceeds(deleteDoc(doc(db, 'users/alice/programs/push')));
  });

  it("un autre utilisateur ne peut ni lire ni écrire les données d'Alice", async () => {
    await seedAlice();
    const db = bob();
    for (const p of ['users/alice', 'users/alice/programs/push', 'users/alice/sessionLogs/2026-10-08', 'users/alice/photoData/2026-10-05']) {
      await assertFails(getDoc(doc(db, p)));
      await assertFails(deleteDoc(doc(db, p)));
    }
    await assertFails(setDoc(doc(db, 'users/alice/programs/evil'), program));
    await assertFails(updateDoc(doc(db, 'users/alice'), { name: 'Bob' }));
  });

  it('un visiteur non connecté est refusé', async () => {
    await seedAlice();
    await assertFails(getDoc(doc(anon(), 'users/alice')));
    await assertFails(setDoc(doc(anon(), 'users/alice'), profile));
  });

  it('un email non vérifié est refusé', async () => {
    await seedAlice();
    await assertFails(getDoc(doc(unverified(), 'users/alice')));
    await assertFails(setDoc(doc(unverified(), 'users/alice'), profile));
  });

  it('les collections hors users/ sont fermées', async () => {
    await assertFails(setDoc(doc(alice(), 'admin/config'), { open: true }));
    await assertFails(getDoc(doc(alice(), 'users/alice/secret/x')));
  });
});

describe('validation des écritures', () => {
  it('profil : champs inconnus, bornes et énumérations', async () => {
    const db = alice();
    await assertFails(setDoc(doc(db, 'users/alice'), { ...profile, isAdmin: true }));
    await assertFails(setDoc(doc(db, 'users/alice'), { ...profile, goal: 9 }));
    await assertFails(setDoc(doc(db, 'users/alice'), { ...profile, theme: 'hacker' }));
    await assertFails(setDoc(doc(db, 'users/alice'), { ...profile, split: 'bro' }));
    await assertFails(setDoc(doc(db, 'users/alice'), { ...profile, bodyWeight: 'lourd' }));
    await assertFails(setDoc(doc(db, 'users/alice'), { ...profile, name: 'x'.repeat(41) }));
    await assertFails(setDoc(doc(db, 'users/alice'), { ...profile, goalType: null }));
    await assertSucceeds(setDoc(doc(db, 'users/alice'), { name: 'Alice' }));
  });

  it('programme : ID, icône, jours, nombre d’exercices', async () => {
    const db = alice();
    await assertFails(setDoc(doc(db, 'users/alice/programs/bad id!'), program));
    await assertFails(setDoc(doc(db, 'users/alice/programs/p'), { ...program, icon: 'skull' }));
    await assertFails(setDoc(doc(db, 'users/alice/programs/p'), { ...program, days: [0, 8] }));
    await assertFails(setDoc(doc(db, 'users/alice/programs/p'), { ...program, name: '' }));
    await assertFails(setDoc(doc(db, 'users/alice/programs/p'), { ...program, exercises: Array(41).fill(program.exercises[0]) }));
  });

  it('log de séance : la date doit correspondre à l’ID', async () => {
    const db = alice();
    await assertFails(setDoc(doc(db, 'users/alice/sessionLogs/2026-10-09'), log));
    await assertFails(setDoc(doc(db, 'users/alice/sessionLogs/2026-10-08'), { ...log, minutes: 9999 }));
  });

  it('séance en cours : un seul document "current"', async () => {
    await assertFails(setDoc(doc(alice(), 'users/alice/session/other'), session));
  });

  it('photo : JPEG en octets, 900 Ko max', async () => {
    const db = alice();
    await assertFails(setDoc(doc(db, 'users/alice/photoData/2026-10-05'), { type: 'image/jpeg', bytes: jpeg(900_001) }));
    await assertFails(setDoc(doc(db, 'users/alice/photoData/2026-10-05'), { type: 'image/png', bytes: jpeg(10) }));
    await assertFails(setDoc(doc(db, 'users/alice/photoData/2026-10-05'), { type: 'image/jpeg', bytes: 'data:image/jpeg;base64,AAA' }));
    await assertFails(setDoc(doc(db, 'users/alice/photoData/pas-une-date'), { type: 'image/jpeg', bytes: jpeg(10) }));
  });
});
