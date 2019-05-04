const db = require('../../models/index')
const isLoggedIn = require('../../services/isLoggedIn');
const Op = require('sequelize').Op
const moment = require('moment');
const daysInMonth = require('../../services/daysInMonth')

module.exports = app => {

    app.get('/api/v1/notes', (req,res) => {

      // var days = daysInMonth( moment().month() );
      // var m = new Date().getMonth();
      // loop through days & compare if that equals the day.
      // create array & push it in there. 
      // console.log(days)

      db.note.findAll({
        where: { 
          userId: req.user.id,
          createdAt: {
            [Op.lt]: new Date("2019-05-31"),
            [Op.gte]: new Date("2019-05-01"),
            
          }
        }
        }).then(notes => {
         
          // res.json(contacts)
          res.status(200).json(notes)
      }).catch(err => {
        console.log(err);
      });
  });

}
  