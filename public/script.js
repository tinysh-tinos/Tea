// script.js
const checkboxes = document.querySelectorAll('input[type="checkbox"]')
const nextBtn = document.getElementById('dalee')

const getSelectedIds = () => {
	return Array.from(checkboxes)
		.filter(cb => cb.checked)
		.map(cb => cb.id)
}

// Сохраняем в глобал
window.checkboxData = {
	getSelectedIds,
	lastSelected: []
}

// Обработчик кнопки
nextBtn.addEventListener('click', () => {
	const selected = getSelectedIds()
	window.checkboxData.lastSelected = selected

	// Отправляем событие
	window.dispatchEvent(
		new CustomEvent('userSelectionReady', {
			detail: { selectedIds: selected }
		})
	)

	// Переход на result/index.html
	window.location.href = 'main/index.html'
})
