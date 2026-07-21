from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os, webbrowser, threading
os.chdir(os.path.dirname(os.path.abspath(__file__)))
url='http://127.0.0.1:8765'
threading.Timer(0.8, lambda: webbrowser.open(url)).start()
print(f'Alkander character sheet running at {url}')
print('Close this window to stop the server.')
ThreadingHTTPServer(('127.0.0.1',8765),SimpleHTTPRequestHandler).serve_forever()
