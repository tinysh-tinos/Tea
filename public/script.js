let updateCount = 0
async function loadFromCSV() {
	const errorDiv = document.getElementById('errorMessage')
	errorDiv.textContent = ''
	try {
		const res = await fetch('data.csv?_=' + Date.now())
		if (!res.ok) throw new Error('Ошибка загрузки data.csv')
		const text = await res.text()
		const lines = text.trim().split('\n')
		if (lines.length === 0) {
			throw new Error('CSV файл пуст')
		}
		const header = lines[0].trim()
		let weightValue = 0
		if (header.toLowerCase() === 'main') {
			if (lines.length < 2) {
				throw new Error('Нет данных в CSV файле')
			}
			const lastLine = lines[lines.length - 1]
			weightValue = parseFloat(lastLine.trim())		
			if (isNaN(weightValue)) {
				throw new Error('Некорректное значение в CSV: ' + lastLine)
			}
		} else {
			const lastLine = lines[lines.length - 1]
			weightValue = parseFloat(lastLine.trim())		
			if (isNaN(weightValue)) {
				throw new Error('Некорректное значение в CSV: ' + lastLine)
			}
		}
		updateUI(weightValue)
		updateCount++
		document.getElementById('updateCount').textContent = updateCount
	} catch (e) {
		console.error('Ошибка загрузки CSV:', e)
		errorDiv.textContent = 'Ошибка: ' + e.message
		document.getElementById('weightValue').textContent = 'Ошибка'
		document.getElementById('cupImage').style.display = 'none'
	}
}
function updateUI(weight) {
	const weightDisplay = Math.round(weight)
	document.getElementById('weightValue').textContent = weightDisplay
	let weightText = ''
	let imageSrc = ''
	let cupOnScale = false
	if (weight <= 0) {
		weightText = 'Кружка отсутствует'
		cupOnScale = false
		document.getElementById('cupStatus').textContent = '❌ Нет'
	} else if (weight > 0 && weight <= 50) {
		weightText = 'Пустая кружка (1-50 г)'
		imageSrc = 'images/empty_cup.png'
		cupOnScale = true
		document.getElementById('cupStatus').textContent = '✅ Да (пустая)'
	} else if (weight > 50 && weight <= 150) {
		weightText = 'Мало воды (51-150 г)'
		imageSrc = 'images/small_one.png'
		cupOnScale = true
		document.getElementById('cupStatus').textContent = '✅ Да (мало воды)'
	} else if (weight > 150 && weight <= 250) {
		weightText = 'Средний уровень (151-250 г)'
		imageSrc = 'images/small_two.png'
		cupOnScale = true
		document.getElementById('cupStatus').textContent = '✅ Да (средне)'
	} else if (weight > 250 && weight <= 350) {
		weightText = 'Много воды (251-350 г)'
		imageSrc = 'images/big_one.png'
		cupOnScale = true
		document.getElementById('cupStatus').textContent = '✅ Да (много)'
	} else if (weight > 350 && weight <= 500) {
		weightText = 'Полная кружка (351-500 г)'
		imageSrc = 'images/big_two.png'
		cupOnScale = true
		document.getElementById('cupStatus').textContent = '✅ Да (полная)'
	} else if (weight > 500) {
		weightText = 'Переполнение (>500 г)'
		imageSrc = 'images/big_two.png'
		cupOnScale = true
		document.getElementById('cupStatus').textContent = '⚠️ Переполнение!'
	}
	document.getElementById('weightText').textContent = weightText
	const img = document.getElementById('cupImage')
	if (cupOnScale && imageSrc) {
		img.src = imageSrc + '?t=' + Date.now()
		img.style.display = 'block'
	} else {
		img.style.display = 'none'
	}
}
loadFromCSV()
setInterval(loadFromCSV, 5000)
