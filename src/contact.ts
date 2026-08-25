export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("#contato-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector<HTMLInputElement>("#nome");
    const email = document.querySelector<HTMLInputElement>("#email");
    const mensagem =
      document.querySelector<HTMLTextAreaElement>("#mensagem");

    if (!nome || !email || !mensagem) return;

    const dados = {
      nome: nome.value,
      email: email.value,
      mensagem: mensagem.value,
    };

    try {
      const resposta = await fetch(
        "https://portfolio-i57t.onrender.com/contato",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );

      const resultado = await resposta.json();

      const popup = document.querySelector<HTMLElement>("#contato-popup");
      const popupMensagem =
        document.querySelector<HTMLParagraphElement>(
          "#contato-popup-mensagem"
        );

      if (!popup || !popupMensagem) return;

      popupMensagem.textContent = resultado.mensagem;
      popup.classList.add("contato-popup--visivel");

      setTimeout(() => {
        popup.classList.remove("contato-popup--visivel");
      }, 3000);
    } catch (erro) {
      console.error("Erro durante o envio:", erro);
    }
  });
}