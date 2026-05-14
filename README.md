## Prerequisites

Make sure these are installed before running the project:

- Node.js
- npm
- Android Studio
- Java JDK
- Capacitor CLI

## Run in Android Studio

Run these commands **one by one** from your terminal.

1. Go into the project folder:

   ```bash
   cd "pregancy-main"
   ```

2. Build the web assets:

   ```bash
   npm run build
   ```

3. After the build succeeds, sync Capacitor with the Android project:

   ```bash
   npx cap sync android
   ```

4. Open the project in Android Studio:

   ```bash
   npx cap open android
   ```

From Android Studio you can run the app on an emulator or a connected device.
