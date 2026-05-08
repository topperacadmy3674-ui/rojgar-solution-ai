import requests
from bs4 import BeautifulSoup
import re
from ai_engine import simplify_text

def scrape_gem():
    jobs = []
    url = "https://bidplus.gem.gov.in/all-bids"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    
    try:
        res = requests.get(url, headers=headers, timeout=15, verify=False)
        soup = BeautifulSoup(res.text, 'html.parser')
        bid_blocks = soup.select('.border-block')[:15]
        
        for block in bid_blocks:
            try:
                # 1. बिड नंबर निकालना (जैसे: GEM/2025/B/6732607)
                bid_link_tag = block.find('a', class_='bid_no_hover')
                bid_no = bid_link_tag.text.strip() if bid_link_tag else "N/A"
                
                # 2. आइटम/सर्विस का नाम
                item_div = block.find('p', class_='item_name') or block.find('div', class_='item_name')
                item_text = item_div.text.replace('Items:', '').strip() if item_div else "Outsourcing Service"
                
                # 3. मंत्रालय/विभाग का नाम (Ministry of Defence, etc.)
                dept_div = block.find('p', class_='dept_name') or block.find('div', class_='dept_name')
                dept_text = dept_div.text.replace('Department Name And Address:', '').strip() if dept_div else "Govt Dept"
                # सिर्फ पहली दो लाइनें लें (मंत्रालय का नाम)
                dept_lines = [line.strip() for line in dept_text.split('\n') if line.strip()]
                ministry = dept_lines[0] if dept_lines else "Govt of India"

                # 4. असली डाउनलोड और अप्लाई लिंक बनाना
                # GeM का नियम: https://bidplus.gem.gov.in/show-bid-details/ + encoded bid number
                encoded_bid = bid_no.replace('/', '%2F')
                final_link = f"https://bidplus.gem.gov.in/show-bid-details/{encoded_bid}"

                # AI को भेजें एक बढ़िया टाइटल बनाने के लिए
                raw_title = f"{item_text} Recruitment at {ministry}"
                clean_title = simplify_text(raw_title)

                jobs.append({
                    "title": clean_title,
                    "link": final_link,
                    "src": ministry, # स्रोत में मंत्रालय का नाम दिखेगा
                    "details": f"Bid Number: {bid_no} | Department: {dept_text}"
                })
            except: continue
    except Exception as e:
        print(f"Scraper Error: {e}")
    return jobs