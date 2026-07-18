import serial
import time
import csv
arduino = serial.Serial('COM1', 9600, timeout=1)
time.sleep(2)
try:
    while True:
        line = arduino.readline()
        if line:
            decoded_data = line.decode('utf-8').strip()
            print(decoded_data)
            with open('data.csv', mode='w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow([decoded_data])
            time.sleep(1)            
except KeyboardInterrupt:
    arduino.close()
    print("Порт закрыт")
