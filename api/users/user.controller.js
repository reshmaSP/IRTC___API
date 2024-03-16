const {
  create,
  getUserByUserName,
  addTrain,
  getTrain,
  bookTrainById
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");


function generateUserID(username) {
  const timestamp = new Date().getTime();
  const uniqueID = `user_${timestamp}_${username}`;
  return uniqueID;
}
function generateTrainId(username) {
  const timestamp = new Date().getTime();
  const uniqueID = `user_${timestamp}_${username}`;
  return uniqueID;
}

module.exports = {
  signUp: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    uuid=generateUserID(body.username)
    create(body,uuid, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror"
        });
      }
      return res.status(200).json({
        status:200,
        message:"account created successfully",
        user_id:uuid,
        // data: results
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByUserName(body.username, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.status(201).json({
          success: 0,
          data: "Invalid username or password"
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
          expiresIn: "1h"
        });
        return res.status(200).json({
          status:200,
          message: "login successfully",
          access_token: jsontoken
        });
      } else {
        return res.status(401).json({
          status: "Incorrect username/password provided. Please retry",
           status_code: 401
        });
      }
    });
  },

  addTrain:(req,res) =>{
    const body=req.body
    const train_id=generateTrainId(body.train_name);
    addTrain(body,train_id,(err,results)=>{
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror"
        });
      }
      return res.status(200).json({
        status:200,
        message: "Train added successfully",
        train_id,
        data: results
      });
    })
  },










  getTrain: (req, res) => {
    const src=req.query.src
    const des=req.query.des;
    getTrain(src,des, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found"
        });
      }
      return res.json({
        success: 1,
        data: results
      });
    });
  },



  bookTrain:(req,res)=>{
    const id = req.params.id;
    bookTrainById(id,req, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid train id "
        });
      }
      results.password = undefined;
      return res.json({
        message:"booked successfully",
        data: results
      });
    });
  }
  // getUsers: (req, res) => {
  //   getUsers((err, results) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     return res.json({
  //       success: 1,
  //       data: results
  //     });
  //   });
  // },
  // updateUsers: (req, res) => {
  //   const body = req.body;
  //   const salt = genSaltSync(10);
  //   body.password = hashSync(body.password, salt);
  //   updateUser(body, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     return res.json({
  //       success: 1,
  //       message: "updated successfully"
  //     });
  //   });
  // },
  // deleteUser: (req, res) => {
  //   const data = req.body;
  //   deleteUser(data, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     if (!results) {
  //       return res.json({
  //         success: 0,
  //         message: "Record Not Found"
  //       });
  //     }
  //     return res.json({
  //       success: 1,
  //       message: "user deleted successfully"
  //     });
  //   });
  // }
};
