import os
import sys
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import zipfile

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import db, Chemical, Glassware, Equipment

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def backup_data():
    with app.app_context():
        chemicals = Chemical.query.all()
        glassware = Glassware.query.all()
        equipment = Equipment.query.all()
        chemicals_df = pd.DataFrame([chemical.as_dict() for chemical in chemicals])
        glassware_df = pd.DataFrame([item.as_dict() for item in glassware])
        equipment_df = pd.DataFrame([item.as_dict() for item in equipment])
        
        backup_dir = 'backups'
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        chemicals_df.to_csv(os.path.join(backup_dir, 'backup_chemicals.csv'), index=False)
        glassware_df.to_csv(os.path.join(backup_dir, 'backup_glassware.csv'), index=False)
        equipment_df.to_csv(os.path.join(backup_dir, 'backup_equipment.csv'), index=False)
        print("Backup completed.")

def load_backup_data():
    backup_dir = 'backups'
    chemicals_file = os.path.join(backup_dir, 'backup_chemicals.csv')
    glassware_file = os.path.join(backup_dir, 'backup_glassware.csv')
    equipment_file = os.path.join(backup_dir, 'backup_equipment.csv')
    
    if os.path.exists(chemicals_file) and os.path.getsize(chemicals_file) > 0:
        chemicals_df = pd.read_csv(chemicals_file)
        if not chemicals_df.empty:
            for _, row in chemicals_df.iterrows():
                chemical = Chemical(id=row['id'], name=row['name'], formula=row['formula'], amount=row['amount'])
                db.session.merge(chemical)
    
    if os.path.exists(glassware_file) and os.path.getsize(glassware_file) > 0:
        glassware_df = pd.read_csv(glassware_file)
        if not glassware_df.empty:
            for _, row in glassware_df.iterrows():
                glassware = Glassware(id=row['id'], name=row['name'], amount=row['amount'])
                db.session.merge(glassware)
    
    if os.path.exists(equipment_file) and os.path.getsize(equipment_file) > 0:
        equipment_df = pd.read_csv(equipment_file)
        if not equipment_df.empty:
            for _, row in equipment_df.iterrows():
                equipment = Equipment(id=row['id'], name=row['name'], amount=row['amount'])
                db.session.merge(equipment)
    
    db.session.commit()
    print("Loaded data from backup.")

@app.route('/chemicals', methods=['GET', 'POST'])
def handle_chemicals():
    if request.method == 'POST':
        data = request.json
        new_chemical = Chemical(name=data['name'], formula=data['formula'], amount=data['amount'])
        db.session.add(new_chemical)
        db.session.commit()
        backup_data()
        return jsonify(new_chemical.as_dict()), 201
    elif request.method == 'GET':
        chemicals = Chemical.query.all()
        return jsonify([chemical.as_dict() for chemical in chemicals]), 200

@app.route('/chemicals/<int:id>', methods=['DELETE'])
def delete_chemical(id):
    chemical = Chemical.query.get(id)
    if chemical is None:
        return jsonify({'error': 'Chemical not found'}), 404
    db.session.delete(chemical)
    db.session.commit()
    backup_data()
    return '', 204

@app.route('/glassware', methods=['GET', 'POST'])
def handle_glassware():
    if request.method == 'POST':
        data = request.json
        new_glassware = Glassware(name=data['name'], amount=data['amount'])
        db.session.add(new_glassware)
        db.session.commit()
        backup_data()
        return jsonify(new_glassware.as_dict()), 201
    elif request.method == 'GET':
        glassware = Glassware.query.all()
        return jsonify([item.as_dict() for item in glassware]), 200

@app.route('/glassware/<int:id>', methods=['DELETE'])
def delete_glassware(id):
    glassware = Glassware.query.get(id)
    if glassware is None:
        return jsonify({'error': 'Glassware not found'}), 404
    db.session.delete(glassware)
    db.session.commit()
    backup_data()
    return '', 204

@app.route('/equipment', methods=['GET', 'POST'])
def handle_equipment():
    if request.method == 'POST':
        data = request.json
        new_equipment = Equipment(name=data['name'], amount=data['amount'])
        db.session.add(new_equipment)
        db.session.commit()
        backup_data()
        return jsonify(new_equipment.as_dict()), 201
    elif request.method == 'GET':
        equipment = Equipment.query.all()
        return jsonify([item.as_dict() for item in equipment]), 200

@app.route('/equipment/<int:id>', methods=['DELETE'])
def delete_equipment(id):
    equipment = Equipment.query.get(id)
    if equipment is None:
        return jsonify({'error': 'Equipment not found'}), 404
    db.session.delete(equipment)
    db.session.commit()
    backup_data()
    return '', 204

@app.route('/download/backup', methods=['GET'])
def download_backup():
    backup_dir = 'backups'
    zip_filename = 'backup.zip'
    zip_filepath = os.path.join(backup_dir, zip_filename)
    
    with zipfile.ZipFile(zip_filepath, 'w') as zipf:
        zipf.write(os.path.join(backup_dir, 'backup_chemicals.csv'), arcname='backup_chemicals.csv')
        zipf.write(os.path.join(backup_dir, 'backup_glassware.csv'), arcname='backup_glassware.csv')
        zipf.write(os.path.join(backup_dir, 'backup_equipment.csv'), arcname='backup_equipment.csv')
    
    return send_from_directory(backup_dir, zip_filename, as_attachment=True)

scheduler = BackgroundScheduler()
scheduler.add_job(backup_data, 'interval', hours=1)
scheduler.start()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        load_backup_data()
    app.run(host="0.0.0.0", port=5000)
