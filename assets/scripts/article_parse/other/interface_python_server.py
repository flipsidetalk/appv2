import cgi
from http.server import BaseHTTPRequestHandler
import io
import sys
import Extractor
import json


QUESTIONS = []

class PostHandler(BaseHTTPRequestHandler):

	ex = Extractor.Extractor()

	def processed(self, data):
		#PARSE DATA
		#UPDATE MODEL
		#RETURN NEW MODEL DATA JSON
		#Sidd will implement
		self.model.add_vote(user_id, question_id, vote)
		out = self.model.get_graph_data()
		# Parse output into JSON of right form
		return out

    def do_POST(self):
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
                processed = self.process(file_data)
                del file_data
                json_string = json.dumps(processed)
				self.wfile.write(json_string)
				self.wfile.close()
            else:
            	processed = self.process(None)
                # Regular form value
                json_string = json.dumps(processed)
                self.wfile.write(json_string)
                self.wfile.close()
        # Disconnect our encoding wrapper from the underlying
        # buffer so that deleting the wrapper doesn't close
        # the socket, which is still being used by the server.
        


if __name__ == '__main__':
    from http.server import HTTPServer
    server = HTTPServer(('localhost', 8080), PostHandler)
    print('Starting server, use <Ctrl-C> to stop')
    server.serve_forever()
