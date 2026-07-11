import serial
import time
import csv
import os

# Открываем Serial-порт (замените 'COM3' на ваш порт, например '/dev/ttyACM0' для Linux)
arduino = serial.Serial('COM1', 9600, timeout=1)

# Даем плате время на перезагрузку
time.sleep(2)

try:
    while True:
        # Считываем строку из порта
        data = [['water', 'photo'] 
                [arduino.readline()]
                ]
        
        # Если данные есть, декодируем их из байтов в строку и убираем лишние пробелы
        if data:
            decoded_data = data.decode('utf-8').strip()
            print(decoded_data)
except KeyboardInterrupt:
    # Закрываем соединение при остановке программы
    arduino.close()
    print("Порт закрыт")

# Открываем файл для записи. encoding='utf-8' важен для русских букв
with open('data/data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    
    # Записываем строки
    writer.writerows(data)