var jwt = require("jsonwebtoken");
var bycrypt = require("bcrypt");
var User = require("../models/user.model");

try {
    
} catch (error) {
    
}
exports.signup = (req, res) => {
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    role: req.body.role,
    password: bycrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: "Ada masalah dalam membuat akun" + err,
      });
      return;
    } else {
      res.status(200).send({
        message: "Berhasil terdaftar",
      });
    }
  });
};

// exports.signin = (req, res) => {
//   User.findOne({
//     email: req.body.email,
//   }).exec((err, user) => {
//     if (err) {
//       res.status(500).send({
//         message: err,
//       });
//       return;
//     }
//     if (!user) {
//       res.status(404).send({
//         message: "User tidak ditemukan",
//       });
//     }

//     var passwordIsValid = bycrypt.compareSync(req.body.password, user.password);

//     if (!passwordIsValid) {
//       return res.status(401).send({
//         accessToken: null,
//         message: "Password salah",
//       });
//     }

//     var token = jwt.sign(
//       {
//         id: user.id,
//       },
//       process.env.API_SECRET,
//       {
//         expiresIn: 86400,
//       }
//     );

//     res.status(200).send({
//       user: {
//         id: user._id,
//         email: user.email,
//         fullName: user.fullName,
//       },
//       message: "Berhasil Login",
//       accessToken: token,
//     });
//   });
// };

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
      })
      .exec((err, user) => {
        if (err) {
          res.status(500)
            .send({
              message: err
            });
          return;
        }
        if (!user) {
          return res.status(404)
            .send({
              message: "User Not found."
            });
        }
  
        //comparing passwords
        var passwordIsValid = bycrypt.compareSync(
          req.body.password,
          user.password
        );
        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
          return res.status(401)
            .send({
              accessToken: null,
              message: "Invalid Password!"
            });
        }
        //signing token with user id
        try {
            var token = jwt.sign({
                id: user.id
              }, process.env.API_SECRET, {
                expiresIn: 86400
              });
        } catch (error) {
            console.log(error)
        }
  
        //responding to client request with user profile success message and  access token .
        res.status(200)
          .send({
            user: {
              id: user._id,
              email: user.email,
              fullName: user.fullName,
              role : user.role
            },
            message: "Login successfull",
            accessToken: token,
          });
      });
  };