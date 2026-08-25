// main.ts
//
// Ponto de entrada: só importa e liga as peças. A lógica de cada
// funcionalidade mora no seu próprio módulo (ver navigation.ts) — main.ts
// não deve virar, de novo, um arquivo que acumula tudo sem relação.

import { initContactForm } from "./contact";
import { initNavigation } from "./navigation.ts";
import { initCertificates } from "./certificates.ts";

console.log('Vite + TypeScript rodando ✅');

initContactForm();
initNavigation();
initCertificates();

// Pequeno exemplo real (não um placeholder inventado) de por que o modo
// "strict" do TypeScript importa: querySelector() pode retornar null, e o
// compilador obriga a tratar esse caso ANTES de usar o elemento — exatamente
// o tipo de erro que passava despercebido no JavaScript antigo (ver auditoria,
// seção 4, "Eventos existentes").
const anoElemento = document.querySelector<HTMLSpanElement>('#ano-atual');

if (anoElemento) {
  anoElemento.textContent = String(new Date().getFullYear());
}
