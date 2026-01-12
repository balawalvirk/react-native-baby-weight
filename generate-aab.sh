#!/bin/bash

# Script to generate Android App Bundle (.aab) for React Native app
# This script will create a production-ready .aab file for Google Play Store upload

set -e  # Exit on error

echo "🚀 Starting Android App Bundle (.aab) generation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if android directory exists
if [ ! -d "android" ]; then
    echo -e "${RED}❌ Error: android directory not found.${NC}"
    exit 1
fi

# Step 1: Clean previous builds
echo -e "${YELLOW}📦 Step 1: Cleaning previous builds...${NC}"
cd android
./gradlew clean
cd ..
echo -e "${GREEN}✅ Clean completed${NC}"
echo ""

# Step 2: Remove duplicate drawable resources
echo -e "${YELLOW}📦 Step 2: Removing duplicate drawable resources...${NC}"
rm -rf android/app/src/main/res/drawable-hdpi
rm -rf android/app/src/main/res/drawable-mdpi
rm -rf android/app/src/main/res/drawable-xhdpi
rm -rf android/app/src/main/res/drawable-xxhdpi
rm -rf android/app/src/main/res/drawable-xxxhdpi
rm -rf android/app/src/main/res/raw
echo -e "${GREEN}✅ Duplicate resources removed${NC}"
echo ""

# Step 3: Generate the AAB file (Gradle will handle JS bundling automatically)
echo -e "${YELLOW}📦 Step 3: Generating Android App Bundle (.aab)...${NC}"
cd android
./gradlew bundleRelease
cd ..
echo -e "${GREEN}✅ AAB file generated${NC}"
echo ""

# Step 5: Locate and display the AAB file
AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"

if [ -f "$AAB_PATH" ]; then
    echo -e "${GREEN}✅ SUCCESS! Android App Bundle generated successfully!${NC}"
    echo ""
    echo "📍 AAB file location:"
    echo "   $AAB_PATH"
    echo ""
    
    # Get file size
    FILE_SIZE=$(du -h "$AAB_PATH" | cut -f1)
    echo "📊 File size: $FILE_SIZE"
    echo ""
    
    # Get app version info
    VERSION_NAME=$(grep "versionName" android/app/build.gradle | head -1 | sed "s/.*versionName '\(.*\)'/\1/")
    VERSION_CODE=$(grep "versionCode" android/app/build.gradle | head -1 | sed "s/.*versionCode \(.*\)/\1/")
    
    echo "📱 App version: $VERSION_NAME (Build $VERSION_CODE)"
    echo ""
    
    echo -e "${YELLOW}📤 Next steps:${NC}"
    echo "   1. Test the AAB file using bundletool (optional)"
    echo "   2. Upload to Google Play Console"
    echo "   3. Create a new release in Google Play Console"
    echo ""
    
    # Option to open the output directory
    echo -e "${YELLOW}Would you like to open the output directory? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        open android/app/build/outputs/bundle/release
    fi
else
    echo -e "${RED}❌ Error: AAB file not found at expected location${NC}"
    echo "   Expected: $AAB_PATH"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All done!${NC}"
