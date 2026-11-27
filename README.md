# AutoScraper

Aplikacija za procenu realne vrednosti polovnih automobila.

## Struktura

- `scraper_back/` - Python backend (scraping, baza, API, ML model)
- `scraper_front/` - React frontend (Vite + Tailwind CSS)

## Pokretanje backend-a

```
cd scraper_back
pip install -r requirements.txt
python -m uvicorn api:app --port 8000
```

## Pokretanje frontend-a

```
cd scraper_front
npm install
npm run dev
```

Frontend radi na http://localhost:5173, a backend na http://localhost:8000.
