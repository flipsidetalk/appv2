/* EXAMPLE DATA - remove before deployment
 */
var totalClusterInfo = {"clusterData":[[{"average":0.5,"cluster":0,"sentenceId":"a4s55","phrase":"in moderate agreement"},{"average":-0.3333333333333333,"cluster":0,"sentenceId":"a4s32","phrase":"in moderate disagreement"},{"average":0.5,"cluster":0,"sentenceId":"a1s55","phrase":"in moderate agreement"},{"average":0.8333333333333334,"cluster":0,"sentenceId":"a1s21","phrase":"in strong agreement"},{"average":-0.6666666666666666,"cluster":0,"sentenceId":"a3s15","phrase":"in moderate disagreement"}],[{"average":0,"cluster":1,"sentenceId":"a4s55","phrase":"neutral"},{"average":0,"cluster":1,"sentenceId":"a4s41","phrase":"neutral"},{"average":0,"cluster":1,"sentenceId":"a4s40","phrase":"neutral"},{"average":-0.3333333333333333,"cluster":1,"sentenceId":"a4s27","phrase":"in moderate disagreement"},{"average":0,"cluster":1,"sentenceId":"a4s25","phrase":"neutral"}],[{"average":-0.5,"cluster":2,"sentenceId":"a4s40","phrase":"in moderate disagreement"},{"average":0,"cluster":2,"sentenceId":"a4s27","phrase":"neutral"},{"average":0.25,"cluster":2,"sentenceId":"a4s25","phrase":"in weak agreement"},{"average":0.5,"cluster":2,"sentenceId":"a2s45","phrase":"in moderate agreement"},{"average":0.75,"cluster":2,"sentenceId":"a1s55","phrase":"in strong agreement"}],[{"average":0.25,"cluster":3,"sentenceId":"a4s32","phrase":"in weak agreement"},{"average":0.5,"cluster":3,"sentenceId":"a1s46","phrase":"in moderate agreement"},{"average":0,"cluster":3,"sentenceId":"a1s34","phrase":"neutral"},{"average":-0.25,"cluster":3,"sentenceId":"a1s30","phrase":"in weak disagreement"},{"average":0,"cluster":3,"sentenceId":"a2s18","phrase":"neutral"}]],"extremes":{"yMin":-0.5012789990723624,"xMax":0.5867170129561489,"yMax":0.6841756039985455,"xMin":-0.5220715562703917},"shadeData":[{"cluster":0,"shading":[{"y":-0.1441421105282525,"x":-0.5220715562703917},{"y":-0.3697823555483827,"x":-0.3766614228917927},{"y":-0.3953096049895108,"x":-0.12005938615550224},{"y":-0.2500216908572623,"x":-0.19442428732302652},{"y":0.045556306514005454,"x":-0.3882689819854707},{"y":-0.1441421105282525,"x":-0.5220715562703917}]},{"cluster":1,"shading":[{"y":0.22887569035367122,"x":0.24799967672484496},{"y":0.2593934194553389,"x":0.5867170129561489},{"y":0.33226473195538775,"x":0.3354831091704648},{"y":0.22887569035367122,"x":0.24799967672484496}]},{"cluster":2,"shading":[{"y":0.6841756039985455,"x":-0.3103266877591186},{"y":0.32988976884712085,"x":-0.28141153088113113},{"y":0.2665928548468992,"x":0.035207394017766964},{"y":0.4638843614074746,"x":0.04934027944001254},{"y":0.6841756039985455,"x":-0.3103266877591186}]},{"cluster":3,"shading":[{"y":-0.5012789990723624,"x":0.10166015405304253},{"y":-0.2212672948474511,"x":0.4808719541213589},{"y":-0.09383151087806305,"x":0.3355301552296104},{"y":-0.5012789990723624,"x":0.10166015405304253}]}],"pointData":{"31":{"y":0.2665928548468992,"cluster":2,"x":0.035207394017766964},"34":{"y":0.33226473195538775,"cluster":1,"x":0.3354831091704648},"37":{"y":0.32988976884712085,"cluster":2,"x":-0.28141153088113113},"38":{"y":-0.3953096049895108,"cluster":0,"x":-0.12005938615550224},"39":{"y":-0.2212672948474511,"cluster":3,"x":0.4808719541213589},"40":{"y":-0.5012789990723624,"cluster":3,"x":0.10166015405304253},"41":{"y":0.22887569035367122,"cluster":1,"x":0.24799967672484496},"42":{"y":-0.1441421105282525,"cluster":0,"x":-0.5220715562703917},"43":{"y":0.045556306514005454,"cluster":0,"x":-0.3882689819854707},"44":{"y":-0.3697823555483827,"cluster":0,"x":-0.3766614228917927},"45":{"y":-0.2500216908572623,"cluster":0,"x":-0.19442428732302652},"46":{"y":-0.3658393553041467,"cluster":3,"x":0.2738754177444379},"47":{"y":0.6841756039985455,"cluster":2,"x":-0.3103266877591186},"50":{"y":0.4638843614074746,"cluster":2,"x":0.04934027944001254},"51":{"y":0.2593934194553389,"cluster":1,"x":0.5867170129561489},"10213370026154390":{"y":-0.05534779385182953,"cluster":0,"x":-0.3286277542054012},"10209787576116056":{"y":-0.09383151087806305,"cluster":3,"x":0.3355301552296104}}};
/* Constants and import statements
 */
const PYTHON_SERVER_URL = 'http://54.236.205.41:80/';
const CURRENT_SLUG = 'the-aclu-needs-to-rethink-free-speech';
const CURRENT_ID = 63;
const NUM_FAKE_USERS = 10;
const INIT_SPLIT = 0.8
const path = require('path');
const express = require('express');
const expressVue = require('express-vue');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const morgan = require('morgan');
const async = require('async');
const Sequelize = require('sequelize');
const validateUrl = require('url-validator');
const request = require('request');
const makeSlug = require('slug');
const dateFormat = require('dateformat');
const url = require('url');
const rateLimit = require('express-rate-limit');
const sendWelcomeEmail = require('./email.js');
const utils = require('./utils.js');
const app = express();

/* Set up Vue server-side rendering
 */
const vueOptions = {
  rootPath: path.join(__dirname, '/views'),
  layout: {
    start: '<body><div id="app">',
    end: '</div></body>'
  }
};

const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

/* Set up database connection
 */
var dbconfig;
// Try-catch for automatic switching from test to prod
try {
  dbconfig = require('opsworks'); // RDS prod connection data
} catch (err) {
  dbconfig = {
    db: {
      'host': 'test.chsdfl7vaehp.us-east-1.rds.amazonaws.com',
      'username': 'testuser',
      'password': 'testUser',
      'port': 3306,
      'database': 'test'
    }
  }
}

// Connect to the database instance
var connection = mysql.createConnection({
  host: dbconfig.db.host,
  user: dbconfig.db.username,
  password: dbconfig.db.password,
  port: dbconfig.db.port,
  database: dbconfig.db.database
});

/* Set up sequelize
 */
const sequelize = new Sequelize(dbconfig.db.database, dbconfig.db.username, dbconfig.db.password, {
  host: dbconfig.db.host,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

let db = require('./models/models.js').init(sequelize, Sequelize);

sequelize.sync()
  .then(function(err) {
    console.log('Database successfully synced.');
  }, function(err) {
    console.log('An error occurred while creating the table:', err);
  });

// Logs HTTP requests
app.use(morgan('combined'));
// Enables Express to parse the body of POST requests
app.use(bodyParser.urlencoded({
  extended: true
}));
// Directs Node to the location of static files
app.use(express.static(path.join(__dirname, 'assets')));
// Serves favicon
app.use('/favicon.ico', express.static('favicon.ico'));


/* Set up rate limiting
 */
app.enable('trust proxy');
const apiLimiter = new rateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 100,
  delayMs: 0 // No delaying
});
app.use('/submitLink', apiLimiter);
app.use('/auth/facebook', apiLimiter);
app.use('/localSignup', apiLimiter);
app.use('/localSignin', apiLimiter);

// Code for signup/login authentication
require('./auth.js')(app, connection, db);

// Structure of user object: { id: 14, firstname: 'Forrest', name: 'Forrest Sill' }

/* Get index page
 */
// app.get('/', function(req, res) {
//   db.article.findAll({
//     include: [{
//       model: db.title
//     }, {
//       model: db.author
//     }, {
//       model: db.publication
//     }, {
//       model: db.publicationDate
//     }, {
//       model: db.image
//     }],
//     limit : 20,
//     attributes: {
//       exclude: ['id', 'url', 'updatedAt']
//     },
//     order: [
//       ['createdAt', 'DESC']
//     ]
//   }).then(articles => {
//     let formattedArticles = {};
//     for (var i = 0; i < articles.length; i++) {
//     //for (var i = articles.length -1; i >= 0; --i) {
//       let formattedArticle = {};
//       try {
//         formattedArticle.title = articles[i].title.title;
//       } catch (err) {
//         formattedArticle.title = 'Title Unknown'
//       }
//       formattedArticle.slug = articles[i].slug;
//       try {
//         formattedArticle.author = articles[i].authors[0].name;
//       }
//       catch (err) {
//         formattedArticle.author = 'Author Unknown'
//       }
//       try {
//         formattedArticle.publication = articles[i].publication.name;
//       }
//       catch (err) {
//         formattedArticle.publication = 'Publication Unknown'
//       }
//       try {
//         formattedArticle.publicationDate = dateFormat(articles[i].publicationDate.date, "longDate");
//       }
//       catch (err) {
//         formattedArticle.publicationDate = "Date Unknown"
//       }
//       try {
//         formattedArticle.image = articles[i].image.link;
//       }
//       catch (err) {
//         formattedArticle.image = "No Image Found."
//       }
//       formattedArticles['article' + (i + 1)] = formattedArticle;
//     }
//     console.log('FEATURES: ' + JSON.stringify(formattedArticles));
//     var data = {
//       headercomp: {
//         user: req.user
//       },
//       thumbnailcomp: formattedArticles
//       }
//     res.renderVue('index', data, utils.vue('Flipside — A new side of news.'));
//   });
// });

/* Get article page
 */
app.get('/', function(req, res) {

  //SET ARTICLE TO DRAW FRONT PAGE FROM

  const slug = CURRENT_SLUG;
  db.article.count({
      where: {
        slug: slug
      }
    })
    .then(count => {
      if (count == 0) {
        res.status(404).send('Page not found.');
        return;
      }
      var data = {
        headercomp: {
          user: req.user
        },
        textcomp: {

          //commentData
          showAgreeComments: false,
          showDisagreeComments: false,

          lastUserResponse: '',
          showUserResponse: 'block',
          lastUserVote: '',

          commentData: [

          ],

          displayAgreeComments: [],
          displayDisagreeComments: [],
          displayUnsureComments: [],

          eachDisplayComment:{
            agreeable: '',
            text: ''
          },

          tempseen: false,
          /*** TOOLTIP ATTRIBUTES ***/
          hasUserSeenHelper: false,
          hasUserVoted: false,
          helpdisplay: "none",
          helptop: "0px",
          helpleft: "0px",
          tooldisplay: "none",
          tooltop: "0px",
          toolleft: "0px",
          isHighlighted: false,
          talktop: "0px",
          talkdisplay: "none",
          toolcolor: '#2b2b2b',
          hasvotes: false,
          displayVoteCard: 'block',
          displayContributeCard: false,
          lastVoteValue: '',
          lastReferenced: 660,
          response: {
            sentenceId: "",
            input: ""
          },
          responses: [],
          whyResponse: {
            sentenceId: "",
            input: "",
            vote: ""
          },
          whyResponses: [],
          user: req.user,
          voteCounter: 0,

        },

        mapcomp: {
          tempsentenceId: "",
          groupInfo: {
            label: "",
            size: "",
            sentenceId: "e",
            average: "",
            agree: "",
            disagree: "",
            unsure: ""
          },

          bubbleShades: [],
          bubbleShade: {
            group: '',
            fill: ''
          },

          displayCounter: 0,
          displayEveryone: 'block',
          displayIndividual: false,
          arrayEveryone: [],
          showVotePercents: 'none',
          eachEveryone: {
            sentenceId: '',
            text: '',
            agree: '',
            disagree: '',
            unsure: ''
          },
          arrayClaim: [],
          eachClaim: {
            sentenceId: "",
            text: "",
            agreeable: "",
            percent: "",
          },
          thisBubble: "test test",
          bubbleData: [],

        //  multiplier: 1,
          groupkey: {
            group: '',
            opinion1: '',
            opinion2: '',
            opinion3: ''
          },
          clusterShowing: 0,
          opinionShowing: 1,
          user: req.user,


          acluData: [{"group": 0, "users": ["FAKE_2182_0", "FAKE_2182_1", "FAKE_2182_7", "FAKE_2182_2", "FAKE_2182_3", "FAKE_2182_6", "FAKE_2182_4", "FAKE_2182_8", "FAKE_2182_5", "FAKE_2182_9"], "size": 10, "sentences": [{"sentenceId": "2304", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2308", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2182", "average": 0.4, "shadeColor": 0.21999999999999997, "controversiality": 0.28982753492378877, "num_votes": 10, "disagree": 0.3, "unsure": 0.0, "agree": 0.7}, {"sentenceId": "2184", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2186", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "1901", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2188", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2318", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2319", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "1899", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2325", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2199", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2200", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2329", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2201", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2333", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2206", "average": 0.4, "shadeColor": 0.21999999999999997, "controversiality": 0.28982753492378877, "num_votes": 10, "disagree": 0.3, "unsure": 0.0, "agree": 0.7}, {"sentenceId": "2334", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2336", "average": 0.4, "shadeColor": 0.21999999999999997, "controversiality": 0.2898275349237887, "num_votes": 10, "disagree": 0.3, "unsure": 0.0, "agree": 0.7}, {"sentenceId": "2209", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2339", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2340", "average": 0.4, "shadeColor": 0.21999999999999997, "controversiality": 0.28982753492378877, "num_votes": 10, "disagree": 0.3, "unsure": 0.0, "agree": 0.7}, {"sentenceId": "2212", "average": -0.4, "shadeColor": -0.38, "controversiality": 0.2898275349237887, "num_votes": 10, "disagree": 0.7, "unsure": 0.0, "agree": 0.3}, {"sentenceId": "2345", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2346", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2220", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2225", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2354", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2226", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2228", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2233", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2363", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2252", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}, {"sentenceId": "2260", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2264", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.3098386676965933, "num_votes": 10, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2275", "average": -0.4, "shadeColor": -0.38, "controversiality": 0.2898275349237887, "num_votes": 10, "disagree": 0.7, "unsure": 0.0, "agree": 0.3}, {"sentenceId": "2281", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.30983866769659335, "num_votes": 10, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2299", "average": 0.0, "shadeColor": 0, "controversiality": 0.31622776601683794, "num_votes": 10, "disagree": 0.5, "unsure": 0.0, "agree": 0.5}]}, {"group": 1, "users": ["FAKE_2182_5", "FAKE_2182_6", "FAKE_2182_7", "FAKE_2182_8", "FAKE_2182_9"], "size": 5, "sentences": [{"sentenceId": "1899", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "1901", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2299", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2252", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2363", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2329", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2325", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2318", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2308", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2304", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2264", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2260", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2199", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2186", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2345", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2340", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2333", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2233", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2228", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2212", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2206", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2201", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2188", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2182", "average": 1.0, "shadeColor": 0.1, "controversiality": 0.0, "num_votes": 5, "disagree": 0.0, "unsure": 0.0, "agree": 1.0}, {"sentenceId": "2354", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2346", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2334", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2319", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2281", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2225", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2220", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2209", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2200", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2184", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2339", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2226", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2336", "average": 0.6, "shadeColor": 0.18, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.2, "unsure": 0.0, "agree": 0.8}, {"sentenceId": "2275", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}]}, {"group": 2, "users": ["FAKE_2182_0", "FAKE_2182_1", "FAKE_2182_2", "FAKE_2182_3", "FAKE_2182_4"], "size": 5, "sentences": [{"sentenceId": "1899", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "1901", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2299", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2252", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2363", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2329", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2325", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2318", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2308", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2304", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2264", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2260", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2199", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2186", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2345", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2340", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2333", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2233", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2228", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2212", "average": -1.0, "shadeColor": -0.5, "controversiality": 0.0, "num_votes": 5, "disagree": 1.0, "unsure": 0.0, "agree": 0.0}, {"sentenceId": "2206", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2201", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2188", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2182", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2354", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2346", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2334", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2319", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2281", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2225", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2220", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.35777087639996635, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2209", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2200", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}, {"sentenceId": "2184", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2339", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2226", "average": -0.2, "shadeColor": -0.33999999999999997, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.6, "unsure": 0.0, "agree": 0.4}, {"sentenceId": "2336", "average": 0.2, "shadeColor": 0.26, "controversiality": 0.4381780460041329, "num_votes": 5, "disagree": 0.4, "unsure": 0.0, "agree": 0.6}, {"sentenceId": "2275", "average": -0.6, "shadeColor": -0.42, "controversiality": 0.3577708763999664, "num_votes": 5, "disagree": 0.8, "unsure": 0.0, "agree": 0.2}]}]

        },
        commentscomp: {
          showComment: false,
          hey: "hello"
        }
      };
      /* Get viz, article, and comment data in parallel,
       * then render the page.
       */
      async.parallel({
          hasUserVoted: function(callback) {
            // console.log(" \n\n\n\n\n\n\n\n\n\n\n TEST for hasUserVoted \n\n\n\n\n\n\n");
            // console.log(req.user);
            // var testUser = req.user;
            // //
            // // console.log(testUser);
            // console.log(testUser['id']);
            if (req.user == undefined) {
              callback(null, false)
            } else {
              db.vote.count({
                where: {
                  'userId': req.user[Object.keys(req.user)[0]]
                }
              }).then(numVotes => {
                var alreadyVoted = false;
                if (numVotes > 0) {
                  alreadyVoted = true;
                }
                callback(null, alreadyVoted)
              });
            }
          },


          viz: function(callback) {
            db.article.findOne({
              where: {
                slug: slug
              },
              attributes: ['id']
            }).then(data => {
              const id = data.dataValues.id;
              db.viz.findAll({
                limit: 1,
                order: [[ 'createdAt', 'DESC' ]],
                where: {
                  articleId: id
                }
              }).then(viz => {
                if (viz && viz[0]) {
                    callback(null, viz);
                } else {
                    //If there is no viz for the article, we need dummy votes
                    //Need all the mainClaim sentenceIds to initialize votes
                    db.sentences.findAll({
                      where: {
                        slug: slug
                      },
                      attributes: ['id', 'mainClaim']
                    }).then(response => {
                      const sentences = article.dataValues.sentences;
                      console.log(sentences);
                      //Create Dummy Votes and insert into db
                      utils.initRandomVotes(db, sentences, NUM_FAKE_USERS, INIT_SPLIT);
                    }).then(() => {
                      //Get new Viz State based on new votes
                      utils.updateVizState(db, res, numCurrentVotes, articleId, sequelize);
                    }).then(() => {
                      //Get that viz state
                      db.viz.findAll({
                        limit: 1,
                        order: [[ 'createdAt', 'DESC' ]],
                        where: {
                          articleId: id
                        }
                      }).then(viz => {
                        //Same as if we already had a viz
                        callback(null, viz);
                      });
                    });
                };
              });
            })
          },
          article: function(callback) {
            db.article.findOne({
              include: [{
                model: db.title
              }, {
                model: db.author
              }, {
                model: db.publication
              }, {
                model: db.publicationDate
              }, {
                model: db.image
              }, {
                model: db.sentence
              }],
              where: {
                slug: slug
              },
              attributes: {
                exclude: ['id', 'slug']
              }
            }).then(article => {
              const sentences = article.dataValues.sentences;
              let reformattedSentences = {};
              for (var i in sentences) {
                reformattedSentences[sentences[i].id] = sentences[i];
                reformattedSentences[sentences[i].id].seen = 0;
              }
              article.dataValues.sentences = reformattedSentences;
              article.dataValues.formattedDate = dateFormat(article.dataValues.publicationDate.date, "longDate");
              callback(null, article.dataValues);
            });
          },
          comments: function(callback) {
            db.article.findOne({
              where: {
                slug: slug
              },
              attributes: ['id']
            }).then(response => {
              const id = response.dataValues.id;
              sequelize.query('SELECT `response`.`id`, `response`.`statement`, `response`.`sentenceId`, `local`.`firstname` AS `lcfn`, `vote`.`reaction` AS `reaction`, `facebook`.`firstname` AS `fbfn` FROM `responses` AS `response` INNER JOIN `sentences` AS `sentence` ON `response`.`sentenceId` = `sentence`.`id` AND `sentence`.`articleId` = ' + id + ' INNER JOIN `votes` AS `vote` ON `response`.`voteId` = `vote`.`id` LEFT JOIN `local` ON `vote`.`userId` = `local`.`id` LEFT JOIN `facebook` ON `vote`.`userId` = `facebook`.`id`')
              .then(comments => {
                comments = comments[0];
                for (var i in comments) {
                  comments[i].firstname = comments[i].lcfn ? comments[i].lcfn : comments[i].fbfn;
                  comments[i].lcfn = undefined;
                  comments[i].fbfn = undefined;
                }
                callback(null, comments);
              });
            });
          }
        },
        function(err, results) {
          if (err) {
            console.log(err);
          } else {
            data.textcomp.hasUserVoted = results.hasUserVoted;
            data.textcomp.article = results.article;
            data.textcomp.commentData = results.comments;
            console.log("COMMENTS: " + JSON.stringify(results.comments));
            if (results.viz && results.viz[0]) {
              data.mapcomp.bubbleData = JSON.parse(results.viz[0].data);
            }
            data.pageTitle = 'Flipside - ' + results.article.title.title;
            res.renderVue('article', data, utils.vue(data.pageTitle));
          }
        });
    });
});

/* currentVotes is the number of votes in the database the last time
 * the viz was rendered. If it hasn't increased, don't re-render.
 */
let numCurrentVotes = 0;
app.post('/submitResponse', function(req, res) {
  db.sentence.findOne({
    where: {
      id: req.body.sentenceId
    },
    attributes: ['articleId']
  }).then(data => {
    const articleId = data.dataValues.articleId;
    db.vote.findOne({
      where: {
        userId: req.user.id,
        sentenceId: req.body.sentenceId
      }
    }).then(vote => {
      db.response.create({
        userId: req.user.id,
        sentenceId: req.body.sentenceId,
        statement: req.body.statement,
        voteId: vote.id
      })
    });
  });
});

// Post link
app.post('/submitLink', function(req, res) {
  // Remove URL params
  let link = req.body.link;
  link = link.split('?')[0];
  // Check if the user submitted a flipsidetalk.com link
  if (url.parse(link).hostname.includes('flipsidetalk.com')) {
    // Send the user to the link they submitted if so
    res.send('to:' + link);
    return;
  }
  if (validateUrl(link)) {
    // Check if URL is already in database.
    db.article.findOne({
      where: {
        url: link
      },
      attributes: ['slug']
    }).then(article => {
      if (article != null) {
        // Article exists in the database, so serve that page.
        res.send('/article/' + JSON.stringify(article.slug).slice(1,-1));
      } else {
        // Article does not exist, so make a call to the article parser server
        // and show the user a loading screen.
        utils.makeExternalRequest(request, PYTHON_SERVER_URL, link, (body) => {
          // Insert article data into database
          if (body != "invalid_url") {
            if (!body.title) {
              res.send('error');
              return;
            }
            console.log('\n\n\n\nARTICLE DATA:\n')
            console.log(JSON.stringify(body))
            console.log('\n\n\n')
            const slug = makeSlug(body.title.title, {
              lower: true
            });
            body.slug = slug;
            body.url = link;
            // Check that the article wasn't submitted again before it was
            // inserted the first time.
            db.article.findOne({
              where: {
                url: link
              }
              }).then(result => {
                if (result == null) {
                  db.article.create(body, {
                    include: [{
                      model: db.title
                    }, {
                      model: db.author
                    }, {
                      model: db.publication
                    }, {
                      model: db.publicationDate
                    }, {
                      model: db.image
                    }, {
                      model: db.sentence
                    }, {
                      model: db.tag,
                      include: [{
                        model: db.rdftype
                      }]
                    }, {
                      model: db.originalText
                    }]
                  }).then(() => {
                    res.send('/article/' + slug);
                  });
                } else {
                  res.send('/article/' + slug);
                }
              });
          } else {
            res.send('invalid_url');
          }
        }, (error) => {
          res.send('error');
        });
      }
    });
  } else {
    res.send('invalid_url');
  }
});

// User validateUrl package to check that the URL is valid
app.post('/checkValidLink', function(req, res) {
  let link = req.body.link;
  link = link.split('?')[0];
  if (validateUrl(link)) {
    res.send('valid');
  } else {
    res.send('invalid');
  }
});

// Post contact form
app.post('/contact', function(req, res) {
  res.send("POST request")
  req.checkBody('name', 'Invalid name.').notEmpty().isAlpha();
  req.checkBody('email', 'Email must not be empty.').notEmpty();
  req.checkBody('message', 'Message must not be empty.').notEmpty();

  req.sanitizeBody('name').escape();
  req.sanitizeBody('email').escape();
  req.sanitizeBody('message').escape();

  var contact = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  };

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
  } else {
    db.contactUs.create({
      name: contact.name,
      email: contact.email,
      message: contact.message
    });
  }
});

// Post email form
app.post('/emails', function(req, res) {
  req.checkBody('email', 'Email must not be empty.').notEmpty();
  req.sanitizeBody('email').escape();
  req.sanitizeBody('location').escape();
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
  } else {
    var signup = {
      email: req.body.email,
      location: req.body.location
    };
    db.email.create({
      email: signup.email,
      location: signup.location
    });
    sendWelcomeEmail("", "", signup.email);
    res.sendStatus(200);
  }
});

// Get status of current user
app.post('/userStatus', function(req, res) {
  if (req.user) {
    res.send({
      signedIn: true,
      id: req.user.id
    });
  } else {
    res.send({
      signedIn: false,
      id: null
    });
  }
});

// Post vote
// app.post('/submitVote', function(req, res) {
//   let user = req.user ? req.user.id : req.sessionID;
//   utils.upsert(db.vote, {
//     userId: user,
//     sentenceId: req.body.sentenceId,
//     reaction: req.body.reaction
//   }, {
//     userId: user,
//     sentenceId: req.body.sentenceId
//   });
//   res.sendStatus(200);
// });

// Post vote
app.post('/submitVote', function(req, res) {
  let user = req.user ? req.user.id : req.sessionID;
  utils.upsert(db.vote, {
    userId: user,
    sentenceId: req.body.sentenceId,
    reaction: req.body.reaction
  }, {
    userId: user,
    sentenceId: req.body.sentenceId
  }).then(() => {
    db.sentence.findOne({
      where: {
        id: req.body.sentenceId
      },
      attributes: ['articleId']
    }).then(data => {
      const articleId = data.dataValues.articleId
      console.log('\n\n\n\nUPDATING VIZ STATE FOR ARTICLE:\n\n')
      console.log(articleId)
      console.log('\n\n\n\n')
      utils.updateVizState(db, res, numCurrentVotes, articleId, sequelize);
    })
  });
  res.sendStatus(200);
});

app.post('/updateVizState', function(req, res) {
  utils.updateVizState(db, res, numCurrentVotes, CURRENT_ID, sequelize);
});


// Get number of votes cast by current user
app.post('/numVotesCast', function(req, res) {
  db.vote.count({
    where: {
      'userId': req.user.id
    }
  }).then(count => {
    res.send(count + '');
  });
});

app.get('/terms', function(req, res) {
  res.render('legal/terms/index');
});

app.get('/privacy', function(req, res) {
  res.render('legal/privacy/index');
});

app.get('/article', function(req, res) {
  res.redirect('/');
});

app.get('*', function(req, res) {
  res.status(404).send('Page not found.');
});

app.listen(process.env.PORT);
console.log('Express server listening on port %d in %s mode.', process.env.PORT, app.settings.env);
