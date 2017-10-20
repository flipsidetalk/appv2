module.exports.upsert = function(table, values, condition) {
  return table.findOne({
      where: condition
    })
    .then(function(obj) {
      if (obj) {
        return obj.update(values);
      } else {
        return table.create(values);
      }
    });
}

module.exports.makeExternalRequest = function(request, url, data, success, err) {
  request({
      url: url,
      method: 'POST',
      json: true,
      body: data
  }, function (error, response, body) {
    console.log('Response: ' + response);
    if (!error) {
      success(body);
    } else  {
      err(error);
    }
  });
}

module.exports.updateVizState = function(db, res, numCurrentVotes, articleId, sequelize) {
  var pythonVis = require('./assets/python-scripts/start_python_script.js');
  var out;
  sequelize.query('SELECT * FROM test.votes INNER JOIN test.sentences on votes.sentenceId = sentences.id INNER JOIN test.articles ON sentences.articleId = articles.id WHERE articleId = ' + articleId)
  .then(inputData => {
    try {
      console.log('\n\n\n\n\n\n\n\n')
      console.log("InputData: " + inputData);
      console.log('\n\n\n\n\n\n\n\n')
      var votes = inputData;
      if (votes.length > numCurrentVotes) {
        numCurrentVotes = votes.length;
        console.log('\n\n\n\n\n\n\n\n')
        pythonVis(votes, (outData) => {
          console.log("outData: " + JSON.stringify(outData));
          if (typeof(res) === 'response') {
            res.send(outData);
          }
          console.log('INSERTING');
          db.viz.create({
            data: outData,
            numVotes: numCurrentVotes,
            articleId: articleId
          });
        });
      }
    } catch (err) {
      console.log(err);
      res.send(509);
    }
  });
}

module.exports.vue = function(pageTitle) {
  return {
    head: {
      title: pageTitle,
      meta: [{
          property: 'og:title',
          content: pageTitle
        },
        {
          name: 'twitter:title',
          content: pageTitle
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico'
        },
        {
          script: 'https://unpkg.com/vue@2.4.2/dist/vue.js'
        },
        {
          script: 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'
        },
        {
          script: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
        },
        {
          script: 'https://d3js.org/d3.v4.js'
        },
        {
          script: '../scripts/fb.js'
        },
        {
          script: '../scripts/main.js'
        },
        {
          style: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
        },
        {
          style: 'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css'
        },
        {
          style: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
        },
        {
          style: 'https://fonts.googleapis.com/css?family=Montserrat:300,400'
        },
        {
          style: '../styles/main.css'
        }
      ]
    }
  }
};

module.exports.initRandomVotes = function(db, sentences, numFakeUsers, split) {
    if (sentences != null) {
        console.log('INSIDE')
        var sentenceIds = [];
        for (sentence in sentences) {
            if (sentence.mainClaim == true) {
                sentenceIds.push(sentence.id)
            }
        }
        console.log('SENTENCES!')
        console.log(sentenceIds)
        var fakeVotes = []
        for (var i = 0; i < numFakeUsers; i++) {
            //First numFakeUsers/2 fake users agree with article split% of time and disagree otherwise
            //Other half of fake users disagree with article split% of time and agree otherwise
            var userFor = (i < Math.floor(numFakeUsers/2))
            //user_ids have special string style.
            var fakeUserId = 50 + i
            for (claim in sentenceIds) {
                var vote = null
                draw = Math.random();
                if (userFor == true) {
                    if (draw > split) {
                        vote = 1
                    } else {
                        vote = -1
                    }
                } else {
                    if (draw > split) {
                        vote = -1
                    } else {
                        vote = 1
                    }
                }
                var data = {"userId": fakeUserId, "sentenceId": claim, "vote": vote}
                console.log('\n\n\nINDIVIDUAL VOTE:')
                console.log(data)
                db.vote.create(data)
                fakeVotes.push(data)
            }
        }
        console.log('\n\n\n\nFINISHED MAKING RANDOM VOTES')
        console.log(JSON.stringify(fakeVotes))
        return fakeVotes
    } else {
        return false
    }
}

