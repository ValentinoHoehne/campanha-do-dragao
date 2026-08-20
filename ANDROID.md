# Gerar o APK (Capacitor + Android Studio)

O APK precisa ser compilado na **sua máquina** — o Android SDK/Gradle não existe aqui.
Todo o resto (Capacitor instalado e configurado) já está pronto no projeto.

## 1. Exportar o projeto

No Lovable: **GitHub → Connect to GitHub → Create Repository**.
Depois, no seu computador:

```bash
git clone <url-do-seu-repo>
cd <pasta-do-repo>
npm install
```

## 2. Pré-requisitos

- Node.js 20+
- [Android Studio](https://developer.android.com/studio) (com Android SDK 34+ e JDK 17)

## 3. Adicionar a plataforma Android

```bash
npx cap add android
npm run build
npx cap sync android
```

## 4. Abrir e gerar o APK

```bash
npx cap open android
```

No Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
O arquivo sai em:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Ou por linha de comando:

```bash
cd android && ./gradlew assembleDebug
```

## 5. Instalar no celular

Envie o `.apk` para o aparelho e instale (ative "Instalar apps de fontes desconhecidas"),
ou com o celular no modo desenvolvedor conectado por USB:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Sobre o `capacitor.config.ts`

O campo `server.url` aponta para o site publicado, então o app nativo abre sempre a
versão mais atual — cada `git push`/publicação atualiza o app sem gerar novo APK.

- Depois de publicar no Lovable, troque a URL pela URL de produção (`*.lovable.app`).
- Se preferir um app **100% offline**, remova o bloco `server` e gere um build estático
  antes de `npx cap sync`. O jogo já salva o progresso localmente no aparelho.

## Publicar na Play Store

Para a loja é preciso um **AAB assinado**: Android Studio → **Build → Generate Signed
Bundle / APK → Android App Bundle**, criando uma keystore própria (guarde-a bem).
