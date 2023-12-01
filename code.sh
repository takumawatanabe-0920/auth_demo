#!/bin/bash

# Google OAuth設定
CLIENT_ID='658478798216-td0kduh6um8appipkc7psv799d8kmplt.apps.googleusercontent.com'
CLIENT_SECRET='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'
REDIRECT_URI='http://localhost:3000/auth/google/callback'

# HTTPレスポンスヘッダー
echo "Content-type: application/json"
echo ""

# 認証コードの取得
CODE=$QUERY_STRING

# Googleからトークンを取得
TOKEN_RESPONSE=$(curl -s -X POST \
  -d code=${CODE} \
  -d client_id=${CLIENT_ID} \
  -d client_secret=${CLIENT_SECRET} \
  -d redirect_uri=${REDIRECT_URI} \
  -d grant_type=authorization_code \
  https://oauth2.googleapis.com/token)

# アクセストークンの抽出
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')

# ユーザー情報を取得
USER_INFO=$(curl -s -H "Authorization: Bearer ${ACCESS_TOKEN}" https://www.googleapis.com/oauth2/v2/userinfo)

# ユーザー情報をクライアントに送信
echo $USER_INFO