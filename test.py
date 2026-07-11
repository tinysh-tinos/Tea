import csv

# Данные для записи
data = [
    ['Имя', 'Возраст', 'Город'],
    ['Анна', 25, 'Москва'],
    ['Иван', 30, 'Санкт-Петербург']
]

# Открываем файл для записи. encoding='utf-8' важен для русских букв
with open('data/data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    
    # Записываем строки
    writer.writerows(data)