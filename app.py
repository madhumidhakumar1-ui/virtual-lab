from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "supersecretkey"   # Required for session

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if username == "student" and password == "1234":
        session['user'] = username
        return redirect(url_for('dashboard'))
    else:
        return "Invalid Credentials"

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('home'))
    return render_template('dashboard.html')

@app.route('/lab')
def lab():
    if 'user' not in session:
        return redirect(url_for('home'))

    lab_type = request.args.get('type')
    return render_template('lab.html', lab_type=lab_type)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)

