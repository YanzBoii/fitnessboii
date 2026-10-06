# Installation et mise en ligne

## En local

Prérequis : Node 22+, Java 21+ (émulateurs).

```bash
npm install
cp .env.example .env        # puis renseigner la config web Firebase
npm run dev
```

Sans projet Firebase, avec les émulateurs locaux (aucun appel réseau vers Firebase) :

```bash
npm run emulators           # terminal 1
npm run dev:emu             # terminal 2
```

Le lien de vérification d'email est alors visible dans la sortie de l'émulateur Auth.

## Tests

```bash
npm test                    # logique métier
npm run test:rules          # règles de sécurité (lance l'émulateur Firestore)
npm run typecheck
```

## Déploiement

1. **Firebase** : projet Spark, Authentication (Email/Mot de passe + Google), Firestore. Déployer les règles : `npm run deploy:rules`.
2. **Netlify** : importer le dépôt GitHub (build et en-têtes lus depuis `netlify.toml`), ajouter les variables `VITE_*` de `.env.example`.
3. **Firebase Auth → Paramètres → Domaines autorisés** : ajouter le domaine Netlify.
4. **App Check** : enregistrer l'app web avec une clé reCAPTCHA v3 (domaine Netlify), renseigner `VITE_RECAPTCHA_SITE_KEY`, redéployer, vérifier les métriques puis activer l'application (« Enforce ») pour Firestore et Authentication.
