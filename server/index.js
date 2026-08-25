import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/contato", async (req, res) => {
  console.log("1 - POST /contato recebido");

  const { nome, email, mensagem } = req.body;

  console.log("2 - Dados recebidos:", {
    nome,
    email,
    mensagem,
  });

  try {
    console.log("3 - Enviando pelo Resend...");

    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
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

    console.log("4 - Resend respondeu");

    if (error) {
      console.error("Erro do Resend:", error);

      return res.status(500).json({
        sucesso: false,
        mensagem: "Não foi possível enviar a mensagem.",
      });
    }

    console.log("5 - E-mail enviado:", data);

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