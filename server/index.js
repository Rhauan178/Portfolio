import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/contato", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      replyTo: email,
      subject: `Contato do portfólio - ${nome}`,
      text: `
Nome: ${nome}
E-mail: ${email}

Mensagem:
${mensagem}
      `,
    });

    res.json({
      sucesso: true,
      mensagem: "Mensagem enviada com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao enviar e-mail:", erro);

    res.status(500).json({
      sucesso: false,
      mensagem: "Não foi possível enviar a mensagem.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});