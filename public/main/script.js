// main/script.js

let updateCount = 0
let userSelection = []

// Слушаем выбор пользователя
window.addEventListener('userSelectionReady', e => {
	userSelection = e.detail.selectedIds
	console.log('[main/script.js] Получен выбор:', userSelection)
})

// Обновляем UI с учётом выбора
function updateUI(weight, selectionIds) {
	const weightDisplay = Math.round(weight)
	document.getElementById('weightValue').textContent = weightDisplay

	let cupText = ''
	let cupImageSrc = ''
	let cupStatus = ''

	// Определяем выбранную позицию
	const selectedItem = selectionIds.length > 0 ? selectionIds[0] : 'none'

	if (weight <= 0) {
		cupText = 'Кружка отсутствует'
		cupImageSrc = ''
		cupStatus = '❌ Нет'
	} else {
		// Для разных выбраных предметов — разные тексты и картинки
		if (selectedItem === 'one') {
			// Кружка
			if (weight > 0 && weight <= 150) {
				cupText = 'Пустая кружка (1-150 г)'
				cupImageSrc = 'images/small_one.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 151 && weight <= 270) {
				cupText = 'Мало воды (151-270 г)'
				cupImageSrc = 'images/small_two.png'
				cupStatus = '✅ Да (мало воды)'
			} else if (weight > 271 && weight <= 350) {
				cupText = 'Полная кружка (271-350 г)'
				cupImageSrc = 'images/big_one.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Полная кружка (>350 г)'
				cupImageSrc = 'images/big_two.png'
				cupStatus = '✅ Да (полная)'
			}
		} else if (selectedItem === 'two') {
			// Бутылка йогурта
			if (weight > 0 && weight <= 150) {
				cupText = 'Пустая бутылка (1-150 г)'
				cupImageSrc = 'images/yogurt_empty.png' // ← новая картинка!
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 151 && weight <= 270) {
				cupText = 'Мало йогурта (151-270 г)'
				cupImageSrc = 'images/yogurt_small.png' // ← новая картинка!
				cupStatus = '✅ Да (мало)'
			} else if (weight > 271 && weight <= 350) {
				cupText = 'Полная бутылка (271-350 г)'
				cupImageSrc = 'images/yogurt_full.png' // ← новая картинка!
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная бутылка (>350 г)'
				cupImageSrc = 'images/yogurt_overflow.png'
				cupStatus = '✅ Да (переполнена)'
			}
		} else if (selectedItem === 'three') {
			// Банка колы
			if (weight > 0 && weight <= 150) {
				cupText = 'Пустая банка (1-150 г)'
				cupImageSrc = 'images/soda_empty.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 151 && weight <= 270) {
				cupText = 'Мало газировки (151-270 г)'
				cupImageSrc = 'images/soda_small.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 271 && weight <= 350) {
				cupText = 'Полная банка (271-350 г)'
				cupImageSrc = 'images/soda_full.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная банка (>350 г)'
				cupImageSrc = 'images/soda_overflow.png'
				cupStatus = '✅ Да (переполнена)'
			}
		} else {
			// Если не выбрано ничего — дефолт (кружка)
			if (weight > 0 && weight <= 150) {
				cupText = 'Пустая кружка (1-150 г)'
				cupImageSrc = 'images/small_one.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 151 && weight <= 270) {
				cupText = 'Мало воды (151-270 г)'
				cupImageSrc = 'images/small_two.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 271 && weight <= 350) {
				cupText = 'Полная кружка (271-350 г)'
				cupImageSrc = 'images/big_one.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная кружка (>350 г)'
				cupImageSrc = 'images/big_two.png'
				cupStatus = '✅ Да (переполнена)'
			}
		}
	}

	// Устанавливаем тексты
	document.getElementById('weightText').textContent = cupText
	document.getElementById('cupStatus').textContent = cupStatus

	// Устанавливаем изображение — ВСЕГДА показываем, если есть src
	const img = document.getElementById('cupImage')
	if (cupImageSrc) {
		img.src = cupImageSrc + '?t=' + Date.now()
		img.style.display = 'block'
	} else {
		img.style.display = 'none'
	}

	updateCount++
	document.getElementById('updateCount').textContent = updateCount
}

// Обновлённая loadFromCSV
async function loadFromCSV() {
	const errorDiv = document.getElementById('errorMessage')
	errorDiv.textContent = ''
	try {
		const res = await fetch('data.csv?_=' + Date.now())
		if (!res.ok) throw new Error('Ошибка загрузки data.csv')
		const text = await res.text()
		const lines = text.trim().split('\n')
		if (lines.length === 0) throw new Error('CSV файл пуст')

		const lastLine = lines[lines.length - 1]
		let weightValue = parseFloat(lastLine.trim())
		if (isNaN(weightValue))
			throw new Error('Некорректное значение в CSV: ' + lastLine)

		// 👇 Передаём userSelection в updateUI
		updateUI(weightValue, userSelection)

		// Отображаем выбор (опционально)
		if (userSelection.length > 0) {
			const selectedText = userSelection
				.map(id => {
					switch (id) {
						case 'one':
							return 'Кружка чая/кофе'
						case 'two':
							return 'Бутылка йогурта'
						case 'three':
							return 'Банка колы/пепси'
						default:
							return ''
					}
				})
				.filter(Boolean)
				.join(', ')
			const infoDiv = document.getElementById('userSelectionInfo')
			if (infoDiv) {
				infoDiv.textContent = `Вы выбрали: ${selectedText}`
			}
		}
	} catch (e) {
		console.error('Ошибка загрузки CSV:', e)
		errorDiv.textContent = 'Ошибка: ' + e.message
		document.getElementById('weightValue').textContent = 'Ошибка'
		document.getElementById('cupImage').style.display = 'none'
	}
}

loadFromCSV()
setInterval(loadFromCSV, 5000)
