// Babel polyfill
require("babelify/polyfill");
// Setup app into global name space
var app = window.app = global.app = {};

// Component::Manifest
var NavBar = require('./components/navbar.es6.js');
var Footer = require('./components/footer.es6.js');
var Jumbotron = require('./components/jumbotron.es6.js');
var Search = require('./components/search.es6.js');
var MemberMeta = require('./components/member_meta.es6.js');
var MembersList = require('./components/members_list.es6.js');
var MemberShowPopup = require('./components/member_show_popup.es6.js');
var MemberShow = require('./components/member_show.es6.js');
var MemberStatus = require('./components/member_status.es6.js');
var Member = require('./components/member.es6.js');
var Languages = require('./components/languages.es6.js');
var Pagination = require('./components/pagination.es6.js');
var NoContent = require('./components/no_content.es6.js');
var EmptyList = require('./components/empty_list.es6.js');

// Include into app namespace
app.NavBar = NavBar;
app.Footer = Footer;
app.Jumbotron = Jumbotron;
app.Search = Search;
app.MemberMeta = MemberMeta;
app.MembersList = MembersList;
app.MemberShowPopup = MemberShowPopup;
app.MemberShow = MemberShow;
app.Languages = Languages;
app.MemberStatus = MemberStatus;
app.Member = Member;
app.NoContent = NoContent;
app.EmptyList = EmptyList;
app.Pagination = Pagination;


