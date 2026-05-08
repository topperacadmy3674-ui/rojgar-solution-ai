from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
import urllib3
from firecrawl import FirecrawlApp # AI Scraper API

# SSL चेतावनियाँ बंद करें
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)
CORS(app)
DB_NAME = "manual_rojgar.db"

# --- 🚀 FIRECRAWL AI SETUP 🚀 ---
# आपकी चाबी यहाँ सेट कर दी है
firecrawl = FirecrawlApp(api_key='fc-de930ca296af4078a582caeaa6f83e86')

# --- 🏗️ DATABASE SETUP (Unified) 🏗️ ---
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # 1. Jobs Table (सभी 23 विस्तृत कॉलम)
    cursor.execute('''CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT, title TEXT, short_info TEXT,
        start_date TEXT, last_date TEXT, fee_last_date TEXT, exam_date TEXT, admit_card_date TEXT,
        fee_gen TEXT, fee_sc TEXT, fee_note TEXT,
        min_age TEXT, max_age TEXT, age_note TEXT,
        total_posts TEXT, vacancy_details TEXT, eligibility_details TEXT,
        how_to_fill TEXT, selection_mode TEXT,
        apply_link TEXT, pdf_link TEXT, syllabus_link TEXT, official_site TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # 2. Sources Table
    cursor.execute('''CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, official_url TEXT, recruitment_url TEXT,
        category TEXT, description TEXT, notes TEXT
    )''')
    
    conn.commit()
    conn.close()

# --- 🌐 JOBS API (Post & Fetch) 🌐 ---
@app.route('/api/add-job', methods=['POST'])
def add_job():
    data = request.json
    try:
        conn = sqlite3.connect(DB_NAME)
        query = '''INSERT INTO jobs 
            (category, title, short_info, start_date, last_date, fee_last_date, exam_date, admit_card_date,
            fee_gen, fee_sc, fee_note, min_age, max_age, age_note, total_posts, vacancy_details, 
            eligibility_details, how_to_fill, selection_mode, apply_link, pdf_link, syllabus_link, official_site) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'''
        
        params = (
            data.get('category'), data.get('title'), data.get('short_info'),
            data.get('start_date'), data.get('last_date'), data.get('fee_last_date'),
            data.get('exam_date'), data.get('admit_card_date'),
            data.get('fee_gen'), data.get('fee_sc'), data.get('fee_note'),
            data.get('min_age'), data.get('max_age'), data.get('age_note'),
            data.get('total_posts'), data.get('vacancy_details'),
            data.get('eligibility_details'), data.get('how_to_fill'),
            data.get('selection_mode'), data.get('apply_link'),
            data.get('pdf_link'), data.get('syllabus_link'), data.get('official_site')
        )
        conn.execute(query, params)
        conn.commit()
        conn.close()
        return jsonify({"msg": "Job Added Successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/jobs/all', methods=['GET'])
def get_all():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM jobs ORDER BY id DESC").fetchall()
    conn.close()
    
    res = {"outsourcing": [], "permanent":[], "admit_card": [], "result": [], "local": [], "admission": [], "yojna": []}
    for r in rows:
        cat = r['category']
        if cat in res: res[cat].append(dict(r))
    return jsonify(res)

@app.route('/api/job-detail/<job_id>', methods=['GET'])
def get_detail(job_id):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    row = conn.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()
    conn.close()
    if row: return jsonify(dict(row))
    return jsonify({"error": "Job Not Found"}), 404

# --- 📁 SOURCES HUB API 📁 ---
@app.route('/api/sources', methods=['GET', 'POST'])
def handle_sources():
    conn = sqlite3.connect(DB_NAME)
    if request.method == 'POST':
        data = request.json
        conn.execute("INSERT INTO sources (name, official_url, recruitment_url, category, description, notes) VALUES (?, ?, ?, ?, ?, ?)",
                     (data['name'], data['official_url'], data['recruitment_url'], data['category'], data['description'], data['notes']))
        conn.commit()
        conn.close()
        return jsonify({"msg": "Saved"}), 201
    
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM sources ORDER BY id DESC").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/api/sources/<int:id>', methods=['DELETE'])
def delete_source(id):
    conn = sqlite3.connect(DB_NAME)
    conn.execute("DELETE FROM sources WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"msg": "Deleted"}), 200

# --- 🤖 AI MAGIC SCANNER (FIRECRAWL) 🤖 ---
@app.route('/api/scan-url', methods=['POST'])
def scan_custom_url():
    target_url = request.json.get('url')
    if not target_url: return jsonify({"error": "URL is required"}), 400

    print(f"Firecrawl AI is scanning: {target_url}")
    try:
        # Firecrawl का उपयोग करके सुरक्षा घेरा तोड़ना
        scrape_result = firecrawl.scrape_url(target_url, params={'formats': ['markdown']})
        content = scrape_result.get('markdown', '')
        
        # मार्कडाउन से लिंक्स निकालना
        found_notices = []
        lines = content.split('\n')
        for line in lines:
            if '[' in line and '](' in line:
                try:
                    title = line.split('[')[1].split(']')[0]
                    link = line.split('(')[1].split(')')[0]
                    # फिल्टर: केवल बड़े नाम और जॉब से जुड़े शब्द
                    if len(title) > 15:
                        found_notices.append({
                            "title": title.upper(),
                            "link": link,
                            "source": target_url.split('//')[-1].split('/')[0]
                        })
                except: continue
        
        return jsonify(found_notices[:40]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    init_db()
    # लाइव सर्वर के लिए पोर्ट सेटिंग
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)