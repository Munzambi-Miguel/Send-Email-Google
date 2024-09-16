import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';  // Importar e habilitar CORS


dotenv.config();

const app = express();
const PORT = 1587;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Middleware do Multer para aceitar múltiplos arquivos com o nome de campo 'attachments'
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Rota para enviar e-mail com múltiplos arquivos
app.post('/send-body2', upload.array('attachments'), async (req, res) => {



    const { to, subject, message, username, password, from, port, name = 'Miguel Buila Show 29 Setembro, 19h' } = req.body;
    const files = req.files as Express.Multer.File[]; // Arquivos enviados



    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
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
        from: `"${name}" <${from}>`, // Seu email
        to: to,                     // Destinatário
        subject: subject,           // Título
        html: message,              // Mensagem
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
    };

    // Enviar o email
    try {
        let info = await transporter.sendMail(mailOptions);

        // Remover os arquivos após envio
        files.forEach(file => fs.unlinkSync(file.path));

        res.status(200).json({ message: 'Email enviado com sucesso!', info: info.response });

    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Api esta a funcionar!' });
})


// Rota para enviar email com anexo PDF
//@ts-ignore
app.post('/send-email', upload.single('attachment'), async (req, res) => {

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
        from: `"${name}" <${from}>`, // Seu email
        to: to,                             // Destinatário
        subject: subject,                   // Título
        html: message,                      // Mensagem
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

    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});


//@ts-ignore
app.post('/send-body', upload.single('attachment'), async (req, res) => {

    const { to, subject, message, username, password, from, port, name = 'Miguel Buila Show 29 Setembro, 19h' } = req.body;



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
        from: `"${name}" <${from}>`, // Seu email
        to: to,                             // Destinatário
        subject: subject,                   // Título
        html: message,                      // Mensagem
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

    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});


// Rota para enviar e-mail com múltiplos arquivos
app.post('/send-body2', upload.array('attachments'), async (req, res) => {
    const { to, subject, message, username, password, from, port, name = 'Miguel Buila Show 29 Setembro, 19h' } = req.body;
    const files = req.files; // Arquivos enviados

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
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
        from: `"${name}" <${from}>`, // Seu email
        to: to,                     // Destinatário
        subject: subject,           // Título
        html: message,              // Mensagem
        //@ts-ignore
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
    };

    // Enviar o email
    try {
        let info = await transporter.sendMail(mailOptions);

        // Remover os arquivos após envio
        //@ts-ignore
        files.forEach(file => fs.unlinkSync(file.path));

        res.status(200).json({ message: 'Email enviado com sucesso!', info: info.response });

    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});



//@ts-ignore
app.post('/send-message', async (req, res) => {
    const { to, subject, message, username, password, from, port, name = 'Miguel Buila Show 29 Setembro, 19h' } = req.body;

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

        from: `"${name}" <${from}>`,     // Seu email
        to: to,         // Destinatário
        subject: subject,  // Título
        html: message   // Mensagem
    };

    // Enviar o email
    try {
        let info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email enviado com sucesso!', info: info.response });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});



//@ts-ignore
app.post('/send-cc', async (req, res) => {
    const { to, subject, message, username, password, from, port, cc, name = 'Miguel Buila Show 29 Setembro, 19h' } = req.body;



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
    let mailOptions: any = {
        from: `"${name}" <${from}>`,  // Formatar nome + email do remetente
        to: to,         // Destinatário
        subject: subject,  // Título
        html: message   // Mensagem
    };

    // Verifica se foi fornecido algum endereço para Cc
    if (cc) {
        mailOptions.cc = cc.split(';');  // Adiciona o Cc, separando os emails por ';'
    }

    // Enviar o email
    try {
        let info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email enviado com sucesso!', info: info.response });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao enviar email', error: error.toString() });
    }
});





// Iniciar o servidor
app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 1587
});
