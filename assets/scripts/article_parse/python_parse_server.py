print('Importing packages...')
import cgi
from http.server import BaseHTTPRequestHandler, HTTPServer
import io
import Extractor
import sys
import json
print('Succesfully imported.')

class PostHandler(BaseHTTPRequestHandler):
	
	def process(url):
		e = Extractor.Extractor()
		return e.get_out_data(url)


	def do_POST(self):

		try:
			if self.path.endswith('.json'):

				# Parse the form data posted
				form = cgi.FieldStorage(
					fp=self.rfile,
					headers=self.headers,
					environ={
					'REQUEST_METHOD': 'POST',
					'CONTENT_TYPE': self.headers['Content-Type'],
					}
				)

				# Begin the response
				self.send_response(200)
				self.send_header('Content-Type',
				         'text/plain; charset=utf-8')
				self.end_headers()


				# Echo back information about what was posted in the form
				for field in form.keys():
					field_item = form[field]
					if field_item.filename:
						# The field contains an uploaded file
						file_data = field_item.file.read()
						url = json.loads(file_data)[0]
						parsed_article = self.process(file_data)
						del file_data
						json_string = json.dumps(processed)
						self.wfile.write(json_string)
						self.wfile.close()
					else:
						pass
		except:
			self.send_error(404, 'file not found')


if __name__ == '__main__':
	print('http server is starting...')
	server = HTTPServer(('127.0.0.1', 8080), PostHandler)
	print('Running server, use <Ctrl-C> to stop')
	server.serve_forever()
