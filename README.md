# WARNING THIS IS MY FIRST NODE PROJECT AND IM REALLY BAD AT PYTHON
# Chemistry Inventory database

This project is indended for classroom use to keep track of Chemicals, Glassware, and Equipment and allow users to modify amounts.

# Update 1
Release: ```8.11.2024```  
Notes:  
```Added edit function by double clicking```  
```Added MSDS info links to chemical names```  [frontend/public/msdsLookup.json](https://github.com/mharrington07/Chem-Inv/blob/master/frontend/public/msdsLookup.json)  
all known chemicals are pulled from [FLINN](https://www.flinnsci.com/api/Search/PersonalizeSearch/1073741972__CatalogContent/1)(change the number at the end of the link to pull more chemicals)

## Installation

Install my-project with git, npm, and pip

```bash
  git clone https://github.com/mharrington07/Chem-Inv.git
  cd Chem-Inv
  cd frontend
  npm Install
  cd ..
  cd backend
  pip install -r requirements.txt
```


    
## Deployment

To deploy this project you must run both backend and frontend with the following;

```bash
    cd backend
    python app.py(for dev)
    use wsgi, pm2(recommended),or another process manager of your choosing for production
    cd ..
    cd frontend
    npm run build(for production)
    npm start(for dev)
```

