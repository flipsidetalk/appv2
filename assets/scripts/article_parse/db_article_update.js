
module.exports = function(url, connection) {
  var python_script_path = 'article_python_script.py'
  
  console.log("url: " + JSON.stringify(url));
  var spawn = require('child_process').spawn
  var py = spawn('python3', [python_script_path])

  var dataString = '';
  var parsed_data

  py.stdout.on('data', function(data){
    dataString += data.toString();
  });

  py.stdout.on('end', function(){
    if (dataString == '') {
      dataString = '{}'
    }
    console.log("dataString: " + dataString);
    var parsed_data = {};
    try {
       parsed_data = JSON.parse(dataString);
    } catch (err) {
      console.log(err);
    }
    addtoDB(connection, parsed_data);
  });

  //Pipes Python's stderr to Node stdout for debugging
  py.stderr.pipe(process.stdout);

  //Input JSON goes here with following format
  var data = [url];
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
}

var insertArticleID = "INSERT INTO article_ids (article_id, url) VALUES ?;"
var insertTitle = "INSERT INTO titles (article_id, title) VALUES ?;"
var insertAuthor = "INSERT INTO authors (article_id, author) VALUES ?;"
var insertPublication = "INSERT INTO authors (article_id, publication) VALUES ?;"
var insertDate = "INSERT INTO dates (article_id, publication_date) VALUES ?;"
var insertSentence = "INSERT INTO sentences (article_id, sentence_text, main_claim, end_paragraph, index) VALUES ?"
var insertImage = "INSERT INTO images (article_id, link) VALUES ?"
var insertTags = "INSERT INTO tags (article_id, tag, score, uri) VALUES ?"
var insertText = "INSERT INTO original_text (article_id, text) VALUES ?"

function addtoDB(con, parsed_data) {
	slug = 'CREATE_ARTICLE_ID'
	runSQL(insertArticleID, [slug, parsed_data['url']], con, function doneInsertingArticle(err){
		if (err) throw err;
		con.query("SELECT id FROM article_ids WHERE slug = " + con.escape(slug), function (err, iden, fields) {
			if (err) throw err;
			console.log('Successfully inserted Article ID');
			runSQL(insertTitle, [iden, parsed_data['title']], con, undefined)
			runSQL(insertAuthor, [iden, parsed_data['author']], con, undefined)
			runSQL(insertPublication [iden, parsed_data['siteName']], con, undefined)
			runSQL(insertDate, [iden, parsed_data['date']], con, undefined)
			runSQL(insertImage, [iden, parsed_data['image']], con, undefined)
			runSQL(insertText, [iden, parsed_data['text']], con, undefined)
			var sent_data = addIden(iden, parsed_data['sents'])
			runSQL(insertSentence, sent_data, con, undefined)
			var tag_data = addIden(iden, parsed_data['tags'])
			runSQL(insertTags, tag_data, con, iden)
		});
	})
}

function addIden(iden, data) {
	for (i = 0; i < data.length; i++) {
		data[i] = [iden].concat(data[i])
	}
	return data
}

function runSQL(command, values, con, callback) {
	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	  var sql = command;
	  con.query(sql, [values], function (err, result) {
	    if (err) throw err;
	    console.log("Inserted");
	  });
	});
	if (typeof callback === 'function' && callback()) {
		callback()
	}
}




