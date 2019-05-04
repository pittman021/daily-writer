const db = require('../../models/index')
const isLoggedIn = require('../../services/isLoggedIn');
const Op = require('sequelize').Op
const moment = require('moment');
const daysInMonth = require('../../services/daysInMonth')

module.exports = app => {

    app.get('/api/v1/notes', (req,res) => {

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

  app.post('/api/v1/notes/new', (req,res) => {
    db.note.create({
      userId: req.user.id,
      content: req.body.content,
      word_count: req.body.word_count
    }).then(newNote => {
      res.status(200).json(newNote)
    }).catch(err => {
      console.log(err);
    })
  });

  app.put('/api/v1/notes/:id/edit', async (req,res) => {

    
    const updates = req.body

    db.note.update({
      content: req.body.content,
      word_count: req.body.word_count
    },
    { where: { id: req.params.id },
    returning: true,
    plain:true
    }).then(updatedNote => {
      console.log(updatedNote)
      res.json(updatedNote);
    }).catch(err => {
      console.log(err);
    })
  });

}
  