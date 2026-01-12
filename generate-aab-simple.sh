#!/bin/bash

# Simple AAB generation script
# Usage: ./generate-aab-simple.sh

echo "🚀 Generating Android App Bundle..."

cd android && ./gradlew clean bundleRelease && cd ..

if [ -f "android/app/build/outputs/bundle/release/app-release.aab" ]; then
    echo "✅ Success! AAB file generated at:"
    echo "   android/app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "File size: $(du -h android/app/build/outputs/bundle/release/app-release.aab | cut -f1)"
else
    echo "❌ Error: AAB file not found"
    exit 1
fi
