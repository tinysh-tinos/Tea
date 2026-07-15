let updateCount = 0

			async function loadFromCSV() {
				try {
					// Добавляем ?_=timestamp, чтобы избежать кэширования
					const res = await fetch('data.csv?_=' + Date.now())
					if (!res.ok) throw new Error('Ошибка загрузки data.csv')

					const text = await res.text()
					const lines = text.trim().split('\n').slice(1) // пропускаем заголовок

					if (lines.length === 0) {
						console.warn('CSV пуст')
						return
					}

					// Берём последнюю строку (свежие данные)
					const lastLine = lines[lines.length - 1]
					const [waterLevel, lightSensor] = lastLine.split(',').map(Number)

					updateUI(waterLevel, lightSensor)
					updateCount++
					document.getElementById('updateCount').textContent = updateCount
				} catch (e) {
					console.error('Ошибка загрузки CSV:', e)
					document.getElementById('waterValue').textContent = 'Ошибка'
					document.getElementById('lightValue').textContent = 'CSV не найден'
					document.getElementById('cupImage').style.display = 'none'
				}
			}

			function updateUI(waterLevel, lightSensor) {
				// Обновляем числовые значения
				document.getElementById('waterValue').textContent = waterLevel
				document.getElementById('lightValue').textContent = lightSensor

				// --- Логика для воды ---
				let waterText = ''
				let imageSrc = ''
				let cupVisible = false

				if (waterLevel <= 100) {
					waterText = 'Мало (1-100)'
					imageSrc = 'images/small_one.png'
					cupVisible = true
				} else if (waterLevel <= 200) {
					waterText = 'Мало (101-200)'
					imageSrc = 'images/small_two.png'
					cupVisible = true
				} else if (waterLevel <= 300) {
					waterText = 'Много (201-300)'
					imageSrc = 'images/big_one.png'
					cupVisible = true
				} else if (waterLevel <= 400) {
					waterText = 'Много (301-400)'
					imageSrc = 'images/big_two.png'
					cupVisible = true
				} else {
					waterText = 'Переполнение (>400)'
					imageSrc = 'images/too_much.png'
					cupVisible = true
				}

				document.getElementById('waterText').textContent = waterText

				// --- Логика для света ---
				let lightText = 'Кружки нет'
				if (lightSensor >= 250) {
					lightText = 'Кружка есть'
					cupVisible = true
				} else {
					cupVisible = false
				}

				document.getElementById('lightText').textContent = lightText

				// --- Финальное решение: показать/скрыть кружку ---
				const img = document.getElementById('cupImage')
				if (cupVisible && imageSrc) {
					// Добавляем ?timestamp, чтобы картинка тоже обновлялась
					img.src = imageSrc + '?t=' + Date.now()
					img.style.display = 'block'
				} else {
					img.style.display = 'none'
				}
			}

			// Загрузить сразу при старте
			loadFromCSV()

			// Обновлять каждые 5 секунд
			setInterval(loadFromCSV, 5000)
