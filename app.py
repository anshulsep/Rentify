from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/rentify'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app, supports_credentials=True)
    db.init_app(app)

    class User(db.Model):
        __tablename__ = 'users'
        id = db.Column(db.Integer, primary_key=True)
        first_name = db.Column(db.String(100), nullable=False)
        last_name = db.Column(db.String(100), nullable=False)
        _password = db.Column(db.String(128), nullable=False)
        mobile_number = db.Column(db.String(20), unique=True, nullable=False)
        email = db.Column(db.String(100), unique=True, nullable=False)
        type = db.Column(db.String(20), nullable=False)

        @property
        def password(self):
            raise AttributeError("password is write-only and cannot be read directly")

        @password.setter
        def password(self, password):
            self._password = generate_password_hash(password)

        def check_password(self, password):
            return check_password_hash(self._password, password)

        def __repr__(self):
            return f"User(id={self.id}, first_name='{self.first_name}', last_name='{self.last_name}', mobile_number='{self.mobile_number}', email='{self.email}', type='{self.type}')"

    class Property(db.Model):
        __tablename__ = 'properties'
        id = db.Column(db.Integer, primary_key=True)
        seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        title = db.Column(db.String(200), nullable=False)
        description = db.Column(db.String(500), nullable=False)
        bedrooms = db.Column(db.Integer, nullable=False)
        bathrooms = db.Column(db.Integer, nullable=False)
        hospitals_nearby = db.Column(db.String(500), nullable=True)
        colleges_nearby = db.Column(db.String(500), nullable=True)

        def __repr__(self):
            return f"Property(id={self.id}, title='{self.title}', description='{self.description}', bedrooms={self.bedrooms}, bathrooms={self.bathrooms}, seller_id={self.seller_id})"

    class Favorite(db.Model):
        __tablename__ = 'favorites'
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)

        def __repr__(self):
            return f"Favorite(id={self.id}, user_id={self.user_id}, property_id={self.property_id})"

    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.json
        if User.query.filter_by(email=data['email']).first() or User.query.filter_by(mobile_number=data['mobile_number']).first():
            return jsonify({"success": False, "message": "User already exists"}), 400

        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            mobile_number=data['mobile_number'],
            type=data['type']
        )
        new_user.password = data['password']

        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success": True}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.json
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            session['user_id'] = user.id
            session['user_type'] = user.type
            return jsonify({"success": True}), 200
        return jsonify({"success": False, "message": "Invalid credentials"}), 400

    @app.route('/logout', methods=['POST'])
    def logout():
        session.pop('user_id', None)
        session.pop('user_type', None)
        return jsonify({"success": True}), 200

    @app.route('/post_property', methods=['POST'])
    def post_property():
        if 'user_id' not in session or session['user_type'] != 'seller':
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        data = request.json
        new_property = Property(
            seller_id=session['user_id'],
            title=data['title'],
            description=data['description'],
            bedrooms=data['bedrooms'],
            bathrooms=data['bathrooms'],
            hospitals_nearby=data.get('hospitals_nearby', ''),
            colleges_nearby=data.get('colleges_nearby', '')
        )

        db.session.add(new_property)
        db.session.commit()
        return jsonify({"success": True, "property": {
            "id": new_property.id,
            "title": new_property.title,
            "description": new_property.description,
            "bedrooms": new_property.bedrooms,
            "bathrooms": new_property.bathrooms,
            "hospitals_nearby": new_property.hospitals_nearby,
            "colleges_nearby": new_property.colleges_nearby
        }}), 201

    @app.route('/update_property/<int:property_id>', methods=['PUT'])
    def update_property(property_id):
        if 'user_id' not in session or session['user_type'] != 'seller':
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        data = request.json
        property_to_update = Property.query.filter_by(id=property_id, seller_id=session['user_id']).first()

        if not property_to_update:
            return jsonify({"success": False, "message": "Property not found"}), 404

        property_to_update.title = data['title']
        property_to_update.description = data['description']
        property_to_update.bedrooms = data['bedrooms']
        property_to_update.bathrooms = data['bathrooms']
        property_to_update.hospitals_nearby = data.get('hospitals_nearby', '')
        property_to_update.colleges_nearby = data.get('colleges_nearby', '')

        db.session.commit()
        return jsonify({"success": True, "property": {
            "id": property_to_update.id,
            "title": property_to_update.title,
            "description": property_to_update.description,
            "bedrooms": property_to_update.bedrooms,
            "bathrooms": property_to_update.bathrooms,
            "hospitals_nearby": property_to_update.hospitals_nearby,
            "colleges_nearby": property_to_update.colleges_nearby
        }}), 200

    @app.route('/delete_property/<int:property_id>', methods=['DELETE'])
    def delete_property(property_id):
        if 'user_id' not in session or session['user_type'] != 'seller':
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        property_to_delete = Property.query.filter_by(id=property_id, seller_id=session['user_id']).first()

        if not property_to_delete:
            return jsonify({"success": False, "message": "Property not found"}), 404

        db.session.delete(property_to_delete)
        db.session.commit()
        return jsonify({"success": True, "message": "Property deleted"}), 200

    @app.route('/my_properties', methods=['GET'])
    def my_properties():
        if 'user_id' not in session or session['user_type'] != 'seller':
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        user_properties = Property.query.filter_by(seller_id=session['user_id']).all()
        properties_list = [{"id": prop.id, "title": prop.title, "description": prop.description, "bedrooms": prop.bedrooms, "bathrooms": prop.bathrooms, "hospitals_nearby": prop.hospitals_nearby, "colleges_nearby": prop.colleges_nearby} for prop in user_properties]

        return jsonify({"success": True, "properties": properties_list}), 200

    @app.route('/properties', methods=['GET'])
    def all_properties():
        properties_list = Property.query.all()
        results = []
        for prop in properties_list:
            results.append({
                "id": prop.id,
                "title": prop.title,
                "description": prop.description,
                "bedrooms": prop.bedrooms,
                "bathrooms": prop.bathrooms,
                "hospitals_nearby": prop.hospitals_nearby,
                "colleges_nearby": prop.colleges_nearby,
                "seller_id": prop.seller_id
            })
        return jsonify({"success": True, "properties": results}), 200

    @app.route('/filter_properties', methods=['POST'])
    def filter_properties():
        filters = request.json
        query = Property.query
        if 'bedrooms' in filters:
            query = query.filter_by(bedrooms=filters['bedrooms'])
        if 'bathrooms' in filters:
            query = query.filter_by(bathrooms=filters['bathrooms'])
        if 'hospitals_nearby' in filters:
            query = query.filter(Property.hospitals_nearby.contains(filters['hospitals_nearby']))
        if 'colleges_nearby' in filters:
            query = query.filter(Property.colleges_nearby.contains(filters['colleges_nearby']))

        filtered_properties = query.all()
        results = []
        for prop in filtered_properties:
            results.append({
                "id": prop.id,
                "title": prop.title,
                "description": prop.description,
                "bedrooms": prop.bedrooms,
                "bathrooms": prop.bathrooms,
                "hospitals_nearby": prop.hospitals_nearby,
                "colleges_nearby": prop.colleges_nearby,
                "seller_id": prop.seller_id
            })
        return jsonify({"success": True, "properties": results}), 200

    @app.route('/favorite_property', methods=['POST'])
    def favorite_property():
        if 'user_id' not in session or session['user_type'] != 'buyer':
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        data = request.json
        new_favorite = Favorite(
            user_id=session['user_id'],
            property_id=data['property_id']
        )

        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({"success": True, "favorite": {
            "id": new_favorite.id,
            "user_id": new_favorite.user_id,
            "property_id": new_favorite.property_id
        }}), 201

    @app.route('/favorites', methods=['GET'])
    def favorites():
        if 'user_id' not in session or session['user_type'] != 'buyer':
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        favorite_properties = Favorite.query.filter_by(user_id=session['user_id']).all()
        results = []
        for favorite in favorite_properties:
            property = Property.query.get(favorite.property_id)
            results.append({
                "id": property.id,
                "title": property.title,
                "description": property.description,
                "bedrooms": property.bedrooms,
                "bathrooms": property.bathrooms,
                "hospitals_nearby": property.hospitals_nearby,
                "colleges_nearby": property.colleges_nearby,
                "seller_id": property.seller_id
            })
        return jsonify({"success": True, "favorites": results}), 200

    @app.route('/user_type', methods=['GET'])
    def get_user_type():
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user:
                return jsonify({"success": True, "type": user.type}), 200
        return jsonify({"success": False, "message": "User not logged in"}), 401

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        app.run(debug=True, port=5000)
