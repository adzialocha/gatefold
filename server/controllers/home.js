function home(req, res) {
  res.render('home');
};

function about(req, res) {
  res.render('about');
};

module.exports = {
  about,
  home,
};
