#!/bin/bash

# Script to fix Gradle build issues and retry with proper configuration
# This script handles network timeouts and dependency download issues

set -e

echo "🔧 Gradle Build Fix & Retry Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Step 1: Stop any running Gradle daemons
echo -e "${YELLOW}📦 Step 1: Stopping Gradle daemons...${NC}"
cd android
./gradlew --stop || true
cd ..
echo -e "${GREEN}✅ Gradle daemons stopped${NC}"
echo ""

# Step 2: Clean Gradle cache (optional - uncomment if needed)
# echo -e "${YELLOW}📦 Step 2: Cleaning Gradle cache...${NC}"
# rm -rf ~/.gradle/caches/
# echo -e "${GREEN}✅ Gradle cache cleaned${NC}"
# echo ""

# Step 3: Clean project
echo -e "${YELLOW}📦 Step 2: Cleaning project...${NC}"
cd android
./gradlew clean --no-daemon
cd ..
echo -e "${GREEN}✅ Project cleaned${NC}"
echo ""

# Step 4: Download dependencies with retry logic
echo -e "${YELLOW}📦 Step 3: Downloading dependencies (this may take a while)...${NC}"
cd android

MAX_RETRIES=3
RETRY_COUNT=0
SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$SUCCESS" = false ]; do
    echo -e "${YELLOW}Attempt $((RETRY_COUNT + 1)) of $MAX_RETRIES...${NC}"
    
    if ./gradlew dependencies --no-daemon --refresh-dependencies; then
        SUCCESS=true
        echo -e "${GREEN}✅ Dependencies downloaded successfully${NC}"
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo -e "${YELLOW}⚠️  Download failed, retrying in 5 seconds...${NC}"
            sleep 5
        else
            echo -e "${RED}❌ Failed to download dependencies after $MAX_RETRIES attempts${NC}"
            cd ..
            exit 1
        fi
    fi
done

cd ..
echo ""

# Step 5: Build the project
echo -e "${YELLOW}📦 Step 4: Building project...${NC}"
cd android
./gradlew assembleRelease --no-daemon --stacktrace
cd ..
echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

echo -e "${GREEN}🎉 All done! Your project is ready.${NC}"
