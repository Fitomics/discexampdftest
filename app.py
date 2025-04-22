from flask import Flask

# Serve everything from the project root (HTML, JS, CSS, images, etc.)
app = Flask(__name__,
            static_folder='.',
            static_url_path='')

@app.route('/')
def index():
    # serve index.html at root
    return app.send_static_file('index.html')

@app.route('/inputs')
def inputs():
    return app.send_static_file('inputs.html')

@app.route('/reporttest')
def report_test():
    return app.send_static_file('reporttest.html')

@app.route('/reportgpt')
def report_gpt():
    return app.send_static_file('reportgpt.html')

@app.route('/<path:filename>')
def serve_file(filename):
    # fallback: serve any other file (images, CSS, JS, etc.)
    return app.send_static_file(filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)