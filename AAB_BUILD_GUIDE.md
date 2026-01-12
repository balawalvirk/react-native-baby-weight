# Android App Bundle (.aab) Build Guide

This guide explains how to generate an Android App Bundle (.aab) file for uploading to the Google Play Store.

## 📋 Prerequisites

Before generating the AAB file, ensure you have:

1. ✅ **Keystore file** configured in `android/gradle.properties`:
   - `MYAPP_UPLOAD_STORE_FILE` - Path to your keystore file
   - `MYAPP_UPLOAD_KEY_ALIAS` - Key alias
   - `MYAPP_UPLOAD_STORE_PASSWORD` - Keystore password
   - `MYAPP_UPLOAD_KEY_PASSWORD` - Key password

2. ✅ **Java Development Kit (JDK)** installed (version 8 or higher)

3. ✅ **Android SDK** properly configured

## 🚀 Quick Start

### Method 1: Using the Automated Script (Recommended)

Run the automated script that handles everything:

```bash
yarn generate-aab
```

or

```bash
./generate-aab.sh
```

This script will:
- Clean previous builds
- Remove duplicate resources (prevents merge errors)
- Generate the AAB file
- Display the output location and file size
- Show app version information

### Method 2: Using Gradle Directly

If you prefer to run Gradle commands directly:

```bash
cd android
./gradlew clean
./gradlew bundleRelease
cd ..
```

### Method 3: Step-by-Step Manual Process

1. **Clean previous builds:**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

2. **Bundle JavaScript (optional but recommended):**
   ```bash
   npx react-native bundle \
     --platform android \
     --dev false \
     --entry-file index.js \
     --bundle-output android/app/src/main/assets/index.android.bundle \
     --assets-dest android/app/src/main/res
   ```

3. **Generate AAB:**
   ```bash
   cd android && ./gradlew bundleRelease && cd ..
   ```

## 📍 Output Location

After successful build, the AAB file will be located at:

```
android/app/build/outputs/bundle/release/app-release.aab
```

To quickly open this directory:

```bash
yarn open-aab
```

or

```bash
open android/app/build/outputs/bundle/release
```

## 🔍 Verifying the AAB File

### Check File Size

```bash
du -h android/app/build/outputs/bundle/release/app-release.aab
```

### Test with Bundletool (Optional)

Google provides a tool called `bundletool` to test your AAB file locally:

1. **Download bundletool:**
   ```bash
   wget https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar
   ```

2. **Generate APKs from AAB:**
   ```bash
   java -jar bundletool-all.jar build-apks \
     --bundle=android/app/build/outputs/bundle/release/app-release.aab \
     --output=my-app.apks \
     --mode=universal
   ```

3. **Extract and install:**
   ```bash
   unzip my-app.apks -d apks
   adb install apks/universal.apk
   ```

## 📤 Uploading to Google Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Navigate to **Production** → **Create new release**
4. Upload the `app-release.aab` file
5. Fill in release notes and other required information
6. Review and roll out the release

## 🐛 Troubleshooting

### Issue: "Keystore file not found"

**Solution:** Ensure your keystore file path in `gradle.properties` is correct:
```properties
MYAPP_UPLOAD_STORE_FILE=path/to/your/keystore.jks
```

### Issue: "Task failed with an exception"

**Solution:** Try cleaning the build:
```bash
cd android
./gradlew clean
./gradlew bundleRelease --stacktrace
```

### Issue: "Out of memory"

**Solution:** The `gradle.properties` already has JVM args configured. If you still face issues, increase the heap size:
```properties
org.gradle.jvmargs=-Xmx8192m
```

### Issue: "Duplicate resources"

**Solution:** Clean the project and remove generated resources:
```bash
cd android
./gradlew clean
rm -rf app/src/main/res/drawable-*
rm -rf app/src/main/res/raw
cd ..
```

Then run the bundle command again.

- **Version Name:** 1.6
- **Version Code:** 8
- **Target SDK:** 35 ✨ (Android 15)
- **Compile SDK:** 35 ✨ (Android 15)

### 🛠 SDK 35 Configuration
The project is fully configured for SDK 35. We use a pinned `aapt2` version in `gradle.properties` to ensure compatibility between the stable AGP 7.4.2 and the newer Android 15 resources:
- `targetSdkVersion = 35`
- `compileSdkVersion = 35`
- `android.aapt2Version=8.6.1-11315950` (Fixes resource linking errors)

```gradle
defaultConfig {
    versionCode 9        // Increment for each release
    versionName '1.7'    // Update version string
}
```

## 🔐 Security Notes

⚠️ **Important:** Never commit your keystore file or passwords to version control!

- Keep your keystore file in a secure location
- Use environment variables or a secure vault for passwords
- Back up your keystore file - you cannot update your app without it!

## 📚 Additional Resources

- [Android App Bundle Documentation](https://developer.android.com/guide/app-bundle)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [React Native Build Documentation](https://reactnative.dev/docs/signed-apk-android)
