import pymysql

def create_database():
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='root',
        charset='utf8mb4'
    )
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS rentify CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;")
    connection.commit()
    cursor.close()
    connection.close()

if __name__ == '__main__':
    create_database()
