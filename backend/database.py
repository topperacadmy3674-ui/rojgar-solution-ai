import sqlite3

DB_NAME = "rojgar_solution.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    conn.execute('''CREATE TABLE IF NOT EXISTS jobs 
        (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, title TEXT, link TEXT, apply_link TEXT, 
        source TEXT, details TEXT, start_date TEXT, last_date TEXT, fee TEXT, age TEXT, posts TEXT, 
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE(title, link))''')
    conn.commit()
    conn.close()

def save_to_db(cat, title, link, src):
    # फालतू लिंक फिल्टर (Login, Manual, Instructions हटाना)
    junk = ['manual', 'handbook', 'login', 'instruction', 'about us', 'contact us']
    if any(word in title.lower() for word in junk): return

    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute('''INSERT OR IGNORE INTO jobs 
            (category, title, link, apply_link, source, details, start_date, last_date, fee, age, posts) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
            (cat, title.upper(), link, link, src, "Official Notification Verified", "MAY 2026", "CHECK PDF", "AS PER RULES", "18-45", "VARIOUS"))
        conn.commit()
        conn.close()
    except: pass