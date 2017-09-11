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
      type: Sequelize.TEXT
    },
    salt: {
      type: Sequelize.STRING
    }
  }, {
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
    firstname: {
      type: Sequelize.STRING
    },
    fbid: {
      type: Sequelize.STRING
    }
  }, {
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
  Article.hasOne(Title);
  tables.title = Title;

  const Author = sequelize.define('author', {
    name: {
      type: Sequelize.STRING
    }
  });
  Article.hasMany(Author);
  tables.author = Author;

  const Publication = sequelize.define('publication', {
    name: {
      type: Sequelize.STRING
    }
  });
  Article.hasOne(Publication);
  tables.publication = Publication;

  const PublicationDate = sequelize.define('publicationDate', {
    date: {
      type: Sequelize.DATE
    }
  });
  Article.hasOne(PublicationDate);
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
  Article.hasMany(Sentence);
  tables.sentence = Sentence;

  const Image = sequelize.define('image', {
    link: {
      type: Sequelize.STRING
    }
  });
  Article.hasOne(Image);
  tables.image = Image;

  const RdfType = sequelize.define('rdfType', {
    url: {
      type: Sequelize.STRING
    }
  });
  tables.rdftype = RdfType;

  const Tag = sequelize.define('tag', {
    label: {
      type: Sequelize.STRING
    },
    score: {
      type: Sequelize.FLOAT
    },
    url: {
      type: Sequelize.STRING
    }
  });
  Tag.hasMany(RdfType);
  Article.hasMany(Tag);
  tables.tag = Tag;

  const OriginalText = sequelize.define('originalText', {
    text: {
      type: Sequelize.TEXT
    }
  });
  Article.hasOne(OriginalText);
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
    }
  });
  Response.belongsTo(Vote);
  tables.response = Response;

  const Viz = sequelize.define('viz', {
    data: {
      type: Sequelize.TEXT
    }
  //  numVotes: {
  //    type: Sequelize.INTEGER
  //  }
  });
  tables.viz = Viz;

  return tables;
}
