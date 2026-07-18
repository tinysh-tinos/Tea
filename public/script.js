// public/script.js

let updateCount = 0
let uservubral = [] // ← Теперь это массив выбранных ID

// 👇 Обработчик выбора пользователя
document.getElementById('vidit').addEventListener('click', () => {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
	uservubral = Array.from(checkboxes).map(cb => cb.id)
	console.log('[script.js] Выбрано:', uservubral)

	// Генерируем кастомное событие (на всякий случай)
	window.dispatchEvent(
		new CustomEvent('userSelectionReady', {
			detail: { selectedIds: uservubral }
		})
	)

	// Переключаем интерфейс
	document.querySelector('.vubor1').style.display = 'none'
	document.querySelector('.main').style.display = 'block'

	// Запускаем обновление сразу после выбора
	loadFromCSV()
})

// Слушаем выбор (если в будущем захотите вызывать снаружи)
window.addEventListener('userSelectionReady', e => {
	uservubral = e.detail.selectedIds || []
	console.log('[script.js] Получен выбор:', uservubral)
})

// Обновляем UI с учётом выбора
function updateUI(weight, selectionIds) {
	const weightDisplay = Math.round(weight)
	document.getElementById('weightValue').textContent = weightDisplay

	let cupText = ''
	let cupImageSrc = ''
	let cupStatus = ''

	const selected = selectionIds.length > 0 ? selectionIds[0] : 'one' // дефолт — кружка

	if (weight <= 0) {
		cupText = 'Кружка отсутствует'
		cupImageSrc = ''
		cupStatus = '❌ Нет'
	} else {
		// Теперь используем includes
		if (selectionIds.includes('one')) {
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
				cupText = 'Полная кружка (>350 г)'
				cupImageSrc = 'images/big_two.png'
				cupStatus = '✅ Да (полная)'
			}
		} else if (selectionIds.includes('two')) {
			// Бутылка йогурта
			if (weight > 0 && weight <= 150) {
				cupText = 'Пустая бутылка (1-150 г)'
				cupImageSrc = 'images/small_one1.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 151 && weight <= 270) {
				cupText = 'Мало йогурта (151-270 г)'
				cupImageSrc = 'images/small_two2.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 271 && weight <= 350) {
				cupText = 'Полная бутылка (271-350 г)'
				cupImageSrc = 'images/big_one1.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная бутылка (>350 г)'
				cupImageSrc = 'images/big_two2.png'
				cupStatus = '✅ Да (переполнена)'
			}
		} else if (selectionIds.includes('three')) {
			// Банка колы
			if (weight > 0 && weight <= 150) {
				cupText = 'Пустая банка (1-150 г)'
				cupImageSrc = 'images/small_one3.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 151 && weight <= 270) {
				cupText = 'Мало газировки (151-270 г)'
				cupImageSrc = 'images/small_two4.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 271 && weight <= 350) {
				cupText = 'Полная банка (271-350 г)'
				cupImageSrc = 'images/big_one3.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная банка (>350 г)'
				cupImageSrc = 'images/big_two4.png'
				cupStatus = '✅ Да (переполнена)'
			}
		} else {
			// Дефолт — кружка
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

	document.getElementById('weightText').textContent = cupText
	document.getElementById('cupStatus').textContent = cupStatus

	// Устанавливаем изображение
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

		// Передаём выбор (uservubral)
		updateUI(weightValue, uservubral)
	} catch (e) {
		console.error('Ошибка загрузки CSV:', e)
		errorDiv.textContent = 'Ошибка: ' + e.message
		document.getElementById('weightValue').textContent = 'Ошибка'
		document.getElementById('cupImage').style.display = 'none'
	}
}

loadFromCSV()
setInterval(loadFromCSV, 5000)
