"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpecificUser = exports.loginUser = exports.registerUser = void 0;

var _expressValidator = require("express-validator");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jwtGenerator = require("../utils/jwtGenerator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//Register logic goes here
var registerUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, first_name, last_name, email, phone_no, password, errors, saltRound, salt, bcryptPassword, newUser, token;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, first_name = _req$body.first_name, last_name = _req$body.last_name, email = _req$body.email, phone_no = _req$body.phone_no, password = _req$body.password;
            errors = (0, _expressValidator.validationResult)(req); //Bcrypt user password

            saltRound = 10;
            _context.next = 6;
            return _bcrypt["default"].genSalt(saltRound);

          case 6:
            salt = _context.sent;
            _context.next = 9;
            return _bcrypt["default"].hash(password, salt);

          case 9:
            bcryptPassword = _context.sent;

            if (errors.isEmpty()) {
              _context.next = 12;
              break;
            }

            return _context.abrupt("return", res.status(422).json({
              sucess: false,
              errors: errors.array()
            }));

          case 12:
            _context.next = 14;
            return client.query("INSERT INTO users (first_name, last_name, email, phone_no,password) VALUES($1, $2, $3, $4, $5) RETURNING *", [first_name, last_name, email, phone_no, bcryptPassword]);

          case 14:
            newUser = _context.sent;
            token = (0, _jwtGenerator.jwtGenerator)(newUser.rows[0]);
            res.json({
              token: token,
              expiresIn: "24hours",
              user: newUser.rows[0],
              success: true,
              msg: "User created successfully",
              userId: newUser.rows[0].id
            });
            console.log(token);
            console.log("===========");
            console.log(newUser.rows[0]);
            _context.next = 26;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            res.json(_context.t0.message);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 22]]);
  }));

  return function registerUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.registerUser = registerUser;

var loginUser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body2, email, password, user, validPassword, token;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; //check if user doesnt exist

            _context2.next = 4;
            return client.query("SELECT * FROM users WHERE email = $1", [email]);

          case 4:
            user = _context2.sent;

            if (!(user.rows.length === 0)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.status(401).json({
              message: "User does not exist"
            }));

          case 7:
            _context2.next = 9;
            return _bcrypt["default"].compare(password, user.rows[0].password);

          case 9:
            validPassword = _context2.sent;

            if (validPassword) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", res.status(401).json("password incorrect"));

          case 12:
            //generate token
            token = (0, _jwtGenerator.jwtGenerator)(user.rows[0]);
            res.json({
              token: token,
              msg: "Login successful",
              userId: user.rows[0].id,
              expiresIn: "24hours",
              success: true
            });
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            res.json(_context2.t0.message);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 16]]);
  }));

  return function loginUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //Get specific user


exports.loginUser = loginUser;

var getSpecificUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var errors, user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            errors = (0, _expressValidator.validationResult)(req);

            if (errors.isEmpty()) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return", res.status(422).json({
              errors: errors.array()
            }));

          case 4:
            _context3.next = 6;
            return client.query("SELECT * FROM users WHERE id = ".concat(req.decoded.id));

          case 6:
            user = _context3.sent;
            console.log(user.rows[0]);
            res.status(200).send(user.rows[0]);
            _context3.next = 15;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            res.status(500).send(_context3.t0);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 11]]);
  }));

  return function getSpecificUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getSpecificUser = getSpecificUser;