import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from backend import  Baza

chrome_options = Options()
chrome_options.page_load_strategy = 'eager' 
prefs = {"profile.managed_default_content_settings.images": 2}
chrome_options.add_experimental_option("prefs", prefs)


service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)
driver.maximize_window()

db = Baza()

try:
    
    marka = "Audi"
    model = "A3"
    godina_od = "2012"
    godina_do = "2020"

    base_url = "https://www.polovniautomobili.com/auto-oglasi/pretraga"
    params = f"?brand={marka.lower()}&model[]={model.lower()}&year_from={godina_od}&year_to={godina_do}&without_price=1&sort=renewDate_desc&showOldNew=all"
    full_url = base_url + params
    
    print(f"Direktno odlazim na: {full_url}")
    driver.get(full_url)

    wait = WebDriverWait(driver, 10)
    
    try:
        cookie_btn = WebDriverWait(driver, 2).until(EC.element_to_be_clickable((By.CLASS_NAME, "uk-modal-close")))
        cookie_btn.click()
    except:
        pass

    broj_strane = 1

    while True:
        print(f"--- Obrađujem stranu br. {broj_strane} ---")

        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "article.classified")))

        oglasi = driver.find_elements(By.CSS_SELECTOR, "article.classified")
        
        podaci_za_print = []
        for oglas in oglasi:
            try:
                naslov = oglas.find_element(By.CSS_SELECTOR, ".ga-title").text.strip()
                
                link = oglas.find_element(By.CSS_SELECTOR, ".ga-title").get_attribute("href")
                
                cena = oglas.find_element(By.CLASS_NAME, "price").text.strip()
                
                kilometraza = oglas.find_element(By.CSS_SELECTOR, "div.setInfo:nth-of-type(2) div.top").text.strip()      
                                
                datum = oglas.get_attribute("data-renewdate")
               
                info = oglas.find_element(By.CSS_SELECTOR, "div.setInfo div.top").text.strip()

                datum_proizvodnje = info.split(" ")[0].strip()
                
                karoserija = info.split(" ")[1].strip()
                
                info_bottom = oglas.find_element(By.CSS_SELECTOR, "div.setInfo div.bottom").text.strip()   
                
                gorivo = info_bottom.split(" ")[0].strip() if info_bottom else "Nepoznato"      
                
                kubikaza = info_bottom.split("|")[1].strip() 
                
                snaga = oglas.find_element(By.CSS_SELECTOR, "div.setInfo:nth-of-type(2) div.bottom").text.strip()      
                                
                #print({info_bottom})
                #print({snaga_tekst})                
                
                #podaci_za_print.append(f"Auto: {naslov} | Cena: {cena} | Datum: {datum} | Datum proizvodnje: {datum_proizvodnje} | Karoserija: {karoserija} | Gorivo: {gorivo} | Kubikaza: {kubikaza} | Snaga: {snaga}")
                
                db.ubaci_oglas(naslov, cena, kilometraza, datum,  datum_proizvodnje,  karoserija, gorivo, kubikaza, snaga, link)
                
                #broj_upisanih += 1
            except:
                continue
        #print(f"Upisano {broj_upisanih} novih oglasa u bazu.")
        
        
        print("\n".join(podaci_za_print))

        try:
            sledeca_strana = driver.find_element(By.XPATH, "//a[contains(@class, 'js-pagination-next')]")

            sledeci_url = sledeca_strana.get_attribute("href")
            
            print("Učitavam sledeću stranu...")
            driver.get(sledeci_url) 
            broj_strane += 1
            
        except:
            print("Nema više stranica. Kraj.")
            break

except Exception as e:
    print(f"Greška: {e}")

finally:
    db.zatvori()
    driver.quit()
    #driver.quit()
    input("Gotovo. Pritisni Enter za kraj.")