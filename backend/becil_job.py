import requests
from bs4 import BeautifulSoup

def get_jobs():
    # BECIL का जॉब पेज
    url = "https://www.becil.com/vacancies"
    
    # ब्राउज़र जैसा दिखने के लिए हेडर्स
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    print("वेबसाइट से डेटा निकाल रहा हूँ... कृपया रुकें...\n")

    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # BECIL की वेबसाइट पर जॉब्स <tr> टैग के अंदर होती हैं
            rows = soup.find_all('tr')

            print(f"{'ADVT NO':<15} | {'JOB TITLE'}")
            print("-" * 50)

            # पहली 10 लेटेस्ट जॉब्स दिखाने के लिए
            for row in rows[1:11]:
                cols = row.find_all('td')
                if len(cols) >= 2:
                    advt_no = cols[0].text.strip()
                    title = cols[1].text.strip()
                    print(f"{advt_no:<15} | {title}")
        else:
            print("वेबसाइट नहीं खुल पाई।")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_jobs()