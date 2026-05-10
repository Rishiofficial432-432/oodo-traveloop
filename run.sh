#!/bin/bash

echo "🚀 Booting up Traveloop Full-Stack Prototype..."
echo "📦 Installing any missing backend dependencies..."
npm install express cors --no-fund --no-audit

echo "🌐 Firing up Backend API & Frontend Server..."
node server.js
