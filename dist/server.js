"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_dotenv = __toESM(require("dotenv"));
var import_express = __toESM(require("express"));
var import_nodemailer = __toESM(require("nodemailer"));
var import_multer = __toESM(require("multer"));
var import_fs = __toESM(require("fs"));
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 1587;
var upload = (0, import_multer.default)({ dest: "uploads/" });
app.use(import_express.default.json());
app.post("/send-email", upload.single("attachment"), async (req, res) => {
  const { to, subject, message, username, password } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Arquivo n\xE3o enviado." });
  }
  let transporter = import_nodemailer.default.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    // Use 'true' se estiver usando SSL/TLS
    auth: {
      user: username,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
      // Adicione isso se necessário
    }
  });
  let mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    // Seu email
    to,
    // Destinatário
    subject,
    // Título
    text: message,
    // Mensagem
    attachments: [
      {
        filename: file.originalname,
        path: file.path
      }
    ]
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    import_fs.default.unlinkSync(file.path);
    res.status(200).json({ message: "Email enviado com sucesso!", info: info.response });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar email", error: error.toString() });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
