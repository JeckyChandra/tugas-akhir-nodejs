const Note = require("../models/note.model.js");

exports.create = (req, res) => {
  if (!req.body.content) {
    return res.status(400).send({
      messeage: "Note tidak boleh kosong",
    });
  }

  const note = new Note({
    title: req.body.title || "Tidak berjudul",
    content: req.body.content,
  });

  note.save().then(data =>{
    res.send(data);
  }).catch(err => {
    res.status(500).send({
        message: err.message || "Ada masalah waktu membuat note."
    });
  });
};

exports.findAll = (req, res) => {
  Note.find()
    .then((notes) => {
      res.send(notes);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ada masalah lagi.",
      });
    });
};

exports.findOne = (req, res) => {
  Note.findById(req.params.noteId)
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Tidak ketemu note yang anda maksud :" + req.params.noteId,
        });
      }
      res.send(note);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Tidak ketemu note yang anda maksud :" + req.params.noteId,
        });
      }
      return res.status(500).send({
        message:
          "Ada masalah waktu proses note dengan id :" + req.params.noteId,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body.content) {
    return res.status(404).send({
      message: "Konten note ga bisa kosong mas",
    });
  }

  Note.findByIdAndUpdate(
    req.params.noteId,
    {
      title: req.body.title || "Tanpa judul",
      content: req.body.content,
    },
    { new: true }
  )
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Note tidak ditemukan dengan id" + req.params.noteId,
        });
      }
      res.send(note);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Note tidak ditemukan dengan id" + req.params.noteId,
        });
      }
      return res.status(500).send({
        message: "Ada masalah dengan id" + req.params.noteId,
      });
    });
};

exports.delete = (req, res) => {
  Note.findByIdAndRemove(req.params.noteId)
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Note tidak ditemukan dengan id" + req.params.noteId,
        });
      }
      res.send({ message: "Note berhasil dihapus!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Note tidak ditemukan dengan id" + req.params.noteId,
        });
      }
      return res.status(500).send({
        message: "Ada masalah dengan id" + req.params.noteId,
      });
    });
};
