// server.js
const express = require('express')
const axios = require('axios')

const app = express()
const port = 3000

// Google OAuth 2.0設定
const googleConfig = {
  clientId:
    '909058914711-ocul6dalboo5mh613fmvegs2vrd2g2lj.apps.googleusercontent.com',
  clientSecret: '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',
  redirect: 'https://learn.operatoroverload.com/~htakaya00/oauth/',
}

console.log({ googleConfig })

const googleOAuthURL = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleConfig.clientId}&redirect_uri=${googleConfig.redirect}&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=offline`

  console.log({ url })
  return url
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/auth/google', (req, res) => {
  res.redirect(googleOAuthURL())
})

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code

  // トークンを取得
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code: code,
    client_id: googleConfig.clientId,
    client_secret: googleConfig.clientSecret,
    redirect_uri: googleConfig.redirect,
    grant_type: 'authorization_code',
  })

  const accessToken = response.data.access_token

  // ユーザー情報を取得
  const userInfoResponse = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  res.redirect(
    '/?user=' + encodeURIComponent(JSON.stringify(userInfoResponse.data))
  )
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  // open(`http://localhost:${port}`)
})
