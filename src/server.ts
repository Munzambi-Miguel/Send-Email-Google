import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 1587;

// Configuração do Multer para fazer upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Middleware para tratar JSON no corpo da requisição
app.use(express.json());

// Tipagem para os dados esperados no corpo da requisição
interface EmailRequest extends Request {
    body: {
        to: string;
        subject: string;
        message: string;
        username: string;
        password: string;
    };
    file: Express.Multer.File; // Tipagem para o arquivo enviado
}

app.get('/', (req, res)=>{
    res.status(200).json({ message: 'Api esta a funcionar!' });
})


// Rota para enviar email com anexo PDF
//@ts-ignore
app.post('/send-email', upload.single('attachment'), async (req, res)=> {

    const { to, subject, message } = req.body;

    const username = req.header('username');  
    const password = req.header('password');  
    const from = req.header('from');  
    const port = req.header('port');  

    const file = req.file; // Arquivo enviado

    if (!file) {
        return res.status(400).json({ message: 'Arquivo não enviado.' });
    }

    // Configuração do transporte Nodemailer usando variáveis de ambiente
    let transporter = nodemailer.createTransport({

        host: process.env.MAIL_HOST,
        port: Number(port),
        secure: false, // Use 'true' se estiver usando SSL/TLS
        auth: {
            user: username,
            pass: password
        },
        tls: {
            rejectUnauthorized: false // Adicione isso se necessário
        }
    });

    // Opções do email
    let mailOptions = {
        from: from, // Seu email
        to: to,                             // Destinatário
        subject: subject,                   // Título
        text: message,                      // Mensagem
        attachments: [
            {
                filename: file.originalname,
                path: file.path
            }
        ]
    };

    // Enviar o email
    try {

        let info = await transporter.sendMail(mailOptions);

        // Remover o arquivo após envio
        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'Email enviado com sucesso!', info: info.response });

    } catch (error:any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});


//@ts-ignore
app.post('/send-body', upload.single('attachment'), async (req, res)=> {

    const { to, subject, message, username, password, from, port } = req.body;



    const file = req.file; // Arquivo enviado

    if (!file) {
        return res.status(400).json({ message: 'Arquivo não enviado.' });
    }

    // Configuração do transporte Nodemailer usando variáveis de ambiente
    let transporter = nodemailer.createTransport({
        
        host: process.env.MAIL_HOST,
        port: Number(port),
        secure: false, // Use 'true' se estiver usando SSL/TLS
        auth: {
            user: username,
            pass: password
        },
        tls: {
            rejectUnauthorized: false // Adicione isso se necessário
        }
    });

    // Opções do email
    let mailOptions = {
        from: from, // Seu email
        to: to,                             // Destinatário
        subject: subject,                   // Título
        text: message,                      // Mensagem
        attachments: [
            {
                filename: file.originalname,
                path: file.path
            }
        ]
    };

    // Enviar o email
    try {

        let info = await transporter.sendMail(mailOptions);

        // Remover o arquivo após envio
        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'Email enviado com sucesso!', info: info.response });

    } catch (error:any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});


// Iniciar o servidor
app.listen({
    host:'0.0.0.0',
    port: process.env.PORT?Number(process.env.PORT):1587
});
