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
      console.log("InputData: " + inputData);
      var votes = inputData;
      if (votes.length > numCurrentVotes) {
        numCurrentVotes = votes.length;
        pythonVis(votes, (outData) => {
          console.log("outData: " + outData);
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
          style: 'https://fonts.googleapis.com/css?family=Montserrat:300,400'
        },
        {
          style: '../styles/main.css'
        }
      ]
    }
  }
};
