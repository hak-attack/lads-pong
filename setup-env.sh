#!/bin/bash
echo "Please copy the values from your Firebase config and paste them when prompted:"
echo ""
read -p "API Key: " api_key
read -p "Auth Domain: " auth_domain
read -p "Project ID: " project_id
read -p "Storage Bucket: " storage_bucket
read -p "Messaging Sender ID: " sender_id
read -p "App ID: " app_id

cat > .env << ENVFILE
VITE_FIREBASE_API_KEY=$api_key
VITE_FIREBASE_AUTH_DOMAIN=$auth_domain
VITE_FIREBASE_PROJECT_ID=$project_id
VITE_FIREBASE_STORAGE_BUCKET=$storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$sender_id
VITE_FIREBASE_APP_ID=$app_id
ENVFILE

echo ""
echo "✅ .env file created successfully!"
