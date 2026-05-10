#!/bin/bash

# Traveloop Push Script
# Created by Antigravity

echo "💎 Initializing Project Sync..."
git remote set-url origin https://github.com/Rishiofficial432-432/oodo-traveloop.git || git remote add origin https://github.com/Rishiofficial432-432/oodo-traveloop.git

echo "📦 Staging flattened architecture..."
git add .

echo "📝 Committing restoration..."
git commit -m "🚀 Complete Restoration: Premium UI + Flattened Architecture + Video Fix"

echo "☁️ Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo "✅ Done! Your project is now live on GitHub."
