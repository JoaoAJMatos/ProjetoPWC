# -*- coding: utf-8 -*-

# Joao Matos, 26-01-2023
#
# This script implements a simple HTTP server to launch the web app.
# It's required because some web browsers prevent local JS files from being loaded due to CORS policies.
#
# Error produced by my chromium browser:
#    - "from origin 'null' has been blocked by CORS policy: 
#       Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https."
#
# You can launch the web app by running this script:
# $ python start.py
#
# Or alternatively, if you don't trust scripts your students do, you can just launch a live server instance
# within VSCode or any other IDE that supports it.

import http.server
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
import webbrowser

# This function returns a free open port on the local machine.
# We can't have a hardcoded value for the port because it might be already in use,
# or we may wish to laucnh other instances of this script
def get_free_port():
      s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      s.bind(('', 0))
      port = s.getsockname()[1]
      s.close()
      return port


HOST = 'localhost'
PORT = get_free_port()


if __name__ == '__main__':
      handler = http.server.SimpleHTTPRequestHandler

      #  Override the extensions_map
      #
      # This is needed because for some reason, the default extensions_map doesn't deal with .js files that well.
      # If we don't manually set the MIME type for .js files, the browser will throw the following error:
      #    - "Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/plain". 
      #       Strict MIME type checking is enforced for module scripts per HTML spec."
      #
      # This should cover all the file types we need for the project.
      handler.extensions_map={
            '.html': 'text/html',
            '.png':  'image/png',
            '.jpg':  'image/jpg',
            '.svg':  'image/svg+xml',
            '.css':  'text/css',
            '.js':   'application/x-javascript',
      }

      webServer = socketserver.TCPServer((HOST, PORT), handler)

      try:
            print(f'Server listening at http://{HOST}:{PORT}.')
            webbrowser.open(f'http://{HOST}:{PORT}/index.html')
            webServer.serve_forever()
      except KeyboardInterrupt:
            pass

      print('Server closed')
      webServer.server_close()