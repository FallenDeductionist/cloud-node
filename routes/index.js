module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `contacts` ORDER BY id ASC"; // query database to get all the contacts

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: 'Bienvenido | Ver Contactos',
                contacts: result
            });
        });
    },

    getSearchPage: (req, res) => {
      let keyword = req.body.words;
      console.log(keyword);
      let query = "SELECT * FROM `contacts` WHERE surname = '" + keyword + "' "; // query database to get contacts matching the surname

      // execute query
      db.query(query, (err, result) => {
          if (err) {
              res.redirect('/');
          }
          res.render('index.ejs', {
              title: 'Bienvenido | Ver Contactos',
              contacts: result
          });
      });
  },
};
