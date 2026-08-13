let updateCount = 0
let uservubral = []

// 👇 Обработчик выбора пользователя
document.getElementById('vidit').addEventListener('click', () => {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
	uservubral = Array.from(checkboxes).map(cb => cb.id)
	console.log('[script.js] Выбрано:', uservubral)

	window.dispatchEvent(
		new CustomEvent('userSelectionReady', {
			detail: { selectedIds: uservubral }
		})
	)

	document.querySelector('.vubor1').style.display = 'none'
	document.querySelector('.main').style.display = 'block'

	loadFromCSV()
})

window.addEventListener('userSelectionReady', e => {
	uservubral = e.detail.selectedIds || []
	console.log('[script.js] Получен выбор:', uservubral)
})

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
		// Проверяем выбранный ID (или используем дефолтный 'one', если список пуст)
		const targetId = selectionIds.length > 0 ? selectionIds[0] : 'one'

		if (targetId === 'one') {
			if (weight > 0 && weight <= 112) {
				cupText = 'Пустая кружка (1-112 г)'
				cupImageSrc = 'images/small_one.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 112 && weight <= 225) {
				cupText = 'Мало воды (112-225 г)'
				cupImageSrc = 'images/small_two.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 225 && weight <= 338) {
				cupText = 'Полная кружка (225-338 г)'
				cupImageSrc = 'images/big_one.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная кружка (>338 г)'
				cupImageSrc = 'images/big_two.png'
				cupStatus = '✅ Да (переполнена)'
			}
		} else if (targetId === 'two') {
			if (weight > 0 && weight <= 112) {
				cupText = 'Пустая бутылка (1-112 г)'
				cupImageSrc = 'images/small_one1.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 112 && weight <= 225) {
				cupText = 'Мало йогурта (112-225 г)'
				cupImageSrc = 'images/small_two2.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 225 && weight <= 338) {
				cupText = 'Полная бутылка (225-338 г)'
				cupImageSrc = 'images/big_one1.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная бутылка (>338 г)'
				cupImageSrc = 'images/big_two2.png'
				cupStatus = '✅ Да (переполнена)'
			}
		} else if (targetId === 'three') {
			if (weight > 0 && weight <= 112) {
				cupText = 'Пустая банка (1-112 г)'
				cupImageSrc = 'images/small_one3.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 112 && weight <= 225) {
				cupText = 'Мало газировки (112-225 г)'
				cupImageSrc = 'images/small_two4.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 225 && weight <= 338) {
				cupText = 'Полная банка (225-338 г)'
				cupImageSrc = 'images/big_one3.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная банка (>338 г)'
				cupImageSrc = 'images/big_two4.png'
				cupStatus = '✅ Да (переполнена)'
			}
		} else {
			if (weight > 0 && weight <= 112) {
				cupText = 'Пустая кружка (1-112 г)'
				cupImageSrc = 'images/small_one.png'
				cupStatus = '✅ Да (пустая)'
			} else if (weight > 112 && weight <= 225) {
				cupText = 'Мало воды (112-225 г)'
				cupImageSrc = 'images/small_two.png'
				cupStatus = '✅ Да (мало)'
			} else if (weight > 225 && weight <= 338) {
				cupText = 'Полная кружка (225-338 г)'
				cupImageSrc = 'images/big_one.png'
				cupStatus = '✅ Да (полная)'
			} else {
				cupText = 'Переполненная кружка (>338 г)'
				cupImageSrc = 'images/big_two.png'
				cupStatus = '✅ Да (переполнена)'
			}
		}
	}

	document.getElementById('weightText').textContent = cupText
	document.getElementById('cupStatus').textContent = cupStatus

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
