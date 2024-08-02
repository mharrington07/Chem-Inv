from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Chemical(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    formula = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.String(20), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Glassware(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    amount = db.Column(db.String(20), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Equipment(db.Model):  # Add Equipment model
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    amount = db.Column(db.String(20), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
