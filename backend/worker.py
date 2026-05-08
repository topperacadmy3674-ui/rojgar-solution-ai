import requests
from bs4 import BeautifulSoup
from ai_engine import extract_job_deep_info
from database import save_to_db

def deep_scanner(url, category):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        res = requests.get(url, headers=headers, timeout=15, verify=False)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # पेज का सारा काम का टेक्स्ट निकालो
        page_text = soup.get_text(separator=' ', strip=True)
        
        # AI को पढ़ाओ और स्ट्रक्चर्ड डेटा लो
        ai_structured_data = extract_job_deep_info(page_text)
        
        # डेटाबेस में सेव करो
        title = soup.title.string if soup.title else "New Notification"
        save_to_db(category, title, url, "AI Deep Scanner", ai_structured_data)
        
        print(f"[SUCCESS] AI has analyzed: {url}")
    except Exception as e:
        print(f"Deep Scan Failed for {url}: {e}")