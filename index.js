// index.js
const express = require('express')
const path = require('path')
const app = express()
const PORT = 3000

// Настройка статической папки
app.use(express.static(path.join(__dirname, 'public')))

// Если зашли на корень — перенаправим или можно просто оставить так
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}`)
})
