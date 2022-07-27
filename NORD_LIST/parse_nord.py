from bs4 import BeautifulSoup
import requests as req
import json

url_params = ['0-9']
for i in range(26):
    url_params.append(chr(ord('A') + i))
    
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}

result =[]

for param in url_params:    
    url = "https://rarediseases.org/?s="+ param + "&post_type=rare-diseases"
    print(url)
    Web = req.get(url, headers=headers)
    S = BeautifulSoup(Web.text, 'lxml')
    rare_disease_list = S.find_all('article')
    for rd in rare_disease_list:
        rd_item = {}
        name = rd.h3.a.text
        # print(name)
        rd_item["name"] = name
        link = rd.h3.a['href']
        # print(link)
        rd_item["link"] = link
        rd_item["definition"] = rd.em.text if rd.em else ""
        result.append(rd_item)
# print(result)
print(len(result))
json_string = json.dumps(result, indent=4)

with open("rare_disease_list.json", "w") as outfile:
    outfile.write(json_string)

