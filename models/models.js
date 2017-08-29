module.exports.init = function(sequelize, Sequelize) {
  let tables = {};

  const Local = sequelize.define('local', {
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    }
  },
  {
    tableName: 'local'
  });
  tables.local = Local

  const Facebook = sequelize.define('facebook', {
    token: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    fbid: {
      type: Sequelize.STRING
    }
  },
  {
    tableName: 'facebook'
  });
  tables.facebook = Facebook;

  const Email = sequelize.define('email', {
    email: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    }
  });
  tables.email = Email;

  const ContactUs = sequelize.define('contactUs', {
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING
    }
  });
  tables.contactUs = ContactUs;

  const Article = sequelize.define('article', {
    slug: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    }
  });
  tables.article = Article;

  const Title = sequelize.define('title', {
    title: {
      type: Sequelize.STRING
    }
  });
  Title.belongsTo(Article);
  tables.title = Title;

  const Author = sequelize.define('title', {
    name: {
      type: Sequelize.STRING
    }
  });
  Author.belongsTo(Article);
  tables.author = Author;

  const Publication = sequelize.define('publication', {
    name: {
      type: Sequelize.STRING
    }
  });
  Publication.belongsTo(Article);
  tables.publication = Publication;

  const PublicationDate = sequelize.define('publicationDate', {
    date: {
      type: Sequelize.DATE
    }
  });
  PublicationDate.belongsTo(Article);
  tables.publicationDate = PublicationDate;

  const Sentence = sequelize.define('sentence', {
    text: {
      type: Sequelize.STRING
    },
    mainClaim: {
      type: Sequelize.BOOLEAN
    },
    endParagraph: {
      type: Sequelize.BOOLEAN
    },
    order: {
      type: Sequelize.INTEGER
    }
  });
  Sentence.belongsTo(Article);
  tables.sentence = Sentence;

  const Image = sequelize.define('image', {
    link: {
      type: Sequelize.STRING
    }
  });
  Image.belongsTo(Article);
  tables.image = Image;

  const Tag = sequelize.define('tag', {
    tag: {
      type: Sequelize.STRING
    },
    score: {
      type: Sequelize.FLOAT
    }
  });
  Tag.belongsTo(Article);
  tables.tag = Tag;

  const OriginalText = sequelize.define('originalText', {
    text: {
      type: Sequelize.TEXT
    }
  });
  OriginalText.belongsTo(Article);
  tables.originalText = OriginalText;

  const Vote = sequelize.define('vote', {
    reaction: {
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.STRING
    }
  });
  Vote.belongsTo(Sentence);
  tables.vote = Vote;

  const Response = sequelize.define('response', {
    statement: {
      type: Sequelize.TEXT
    },
    userId: {
      type: Sequelize.STRING
    }
  });
  Response.belongsTo(Sentence);
  tables.response = Response;

  return tables;
}
