// certificates.ts
//
// Carrossel de certificados: cria os cards e indicadores a partir de
// data/certificates.ts, controla qual está ativo, autoplay com pausa
// previsível, e a transição visual entre eles.
//
// Fica separado de navigation.ts porque é uma responsabilidade diferente
// (um componente de conteúdo, não a navegação do site) — a única coisa que
// os dois têm em comum é usar IntersectionObserver, cada um com um
// propósito próprio (destacar link do menu vs. controlar autoplay).
//
// Diferente dos cards de tecnologia da Hero (que são conteúdo fixo, escrito
// direto no HTML), os certificados precisam ser renderizados por código:
// a quantidade varia (2 hoje, mais depois) e o estado de cada card
// (ativo/anterior/próximo/oculto) muda a cada navegação — não dá para
// escrever isso como HTML estático sem duplicar lógica.

import { certificates, type Certificate } from "./data/certificates.ts";

const AUTOPLAY_INTERVAL_MS = 5000;

type CardState = "active" | "prev" | "next" | "hidden";

/**
 * Posição de um certificado em relação ao ativo, para QUALQUER quantidade.
 *
 * Ideia: a distância circular de `index` até `activeIndex` é
 * (index - activeIndex + total) % total. Isso dá sempre um número entre
 * 0 e total-1: 0 é o próprio ativo, 1 é o vizinho seguinte (next), e
 * total-1 é o vizinho anterior (prev) — porque "andar 1 passo para trás"
 * é o mesmo que "andar total-1 passos para frente" num círculo.
 *
 * Com total=2, o único outro item tem distância 1, que é IGUAL a total-1
 * (=1) ao mesmo tempo — por isso a ordem dos "if" importa: checar "prev"
 * antes de "next" faz esse item cair em "prev" (produzindo [anterior][ATIVO],
 * como pedido), sem nenhum código exclusivo para dois itens. Com total>=3,
 * os dois valores nunca coincidem, e o mesmo cálculo já classifica um como
 * "next" e outro como "prev" naturalmente.
 */
function getState(index: number, activeIndex: number, total: number): CardState {
  const distance = (index - activeIndex + total) % total;
  if (distance === 0) return "active";
  if (distance === total - 1) return "prev";
  if (distance === 1) return "next";
  return "hidden";
}

function createCardElement(cert: Certificate): HTMLElement {
  const card = document.createElement("article");
  card.className = "cert-card";

  // Só o card ativo é realmente interativo (ver render(): tabIndex e
  // aria-hidden são ajustados a cada troca) — simplifica a semântica:
  // "o card grande no centro é um link; para trocar de certificado,
  // use as setas ou os indicadores", sem ambiguidade sobre o que um
  // clique num card lateral faria.
  const link = document.createElement("a");
  link.className = "cert-card__link";
  link.href = cert.pdf;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Abrir certificado em PDF: ${cert.title}`);

  const img = document.createElement("img");
  img.className = "cert-card__preview";
  img.src = cert.image;
  img.alt = `Prévia do certificado: ${cert.title}`;
  img.loading = "lazy";
  link.appendChild(img);

  const badge = document.createElement("span");
  badge.className = "cert-card__badge";
  badge.textContent = "CERTIFICADO // ATIVO";
  badge.setAttribute("aria-hidden", "true");
  link.appendChild(badge);

  const info = document.createElement("div");
  info.className = "cert-card__info";

  const title = document.createElement("h3");
  title.className = "cert-card__titulo";
  title.textContent = cert.title;
  info.appendChild(title);

  // instituição/data juntos numa linha, só se pelo menos um existir
  const metaParts = [cert.institution, cert.date].filter((v): v is string => Boolean(v));
  if (metaParts.length > 0) {
    const meta = document.createElement("p");
    meta.className = "cert-card__meta";
    meta.textContent = metaParts.join(" — ");
    info.appendChild(meta);
  }

  if (cert.workload) {
    const workload = document.createElement("p");
    workload.className = "cert-card__meta";
    workload.textContent = `Carga horária: ${cert.workload}`;
    info.appendChild(workload);
  }

  if (cert.description) {
    const desc = document.createElement("p");
    desc.className = "cert-card__descricao";
    desc.textContent = cert.description;
    info.appendChild(desc);
  }

  const action = document.createElement("span");
  action.className = "cert-card__acao";
  action.textContent = "Abrir certificado";
  // o texto já está no aria-label do link — evita duplicar o anúncio pro leitor de tela
  action.setAttribute("aria-hidden", "true");
  info.appendChild(action);

  link.appendChild(info);
  card.appendChild(link);

  if(cert.validationUrl) {
    const validationLink = document.createElement("a"); // Validação de link URL do certificado

    validationLink.className = "cert-card_validation";
    validationLink.href = cert.validationUrl;
    validationLink.target = "_blank";
    validationLink.rel = "noopener noreferrer";
    validationLink.textContent = "Verificar credencial";

    card.appendChild(validationLink);
  }

  return card;
}

export function initCertificates(): void {
  const section = document.querySelector<HTMLElement>("#certificados");
  const track = document.querySelector<HTMLElement>("#certificados-track");
  const indicatorsContainer = document.querySelector<HTMLElement>("#certificados-indicadores");
  const prevButton = document.querySelector<HTMLButtonElement>(".carousel__seta--anterior");
  const nextButton = document.querySelector<HTMLButtonElement>(".carousel__seta--proxima");

  if (!section || !track || !indicatorsContainer || !prevButton || !nextButton) return;
  if (certificates.length === 0) return;

  const total = certificates.length;
  let activeIndex = 0;

  // --- monta os cards e indicadores uma única vez ---
  const cardElements = certificates.map(createCardElement);
  cardElements.forEach((el) => track.appendChild(el));

  const indicatorButtons = certificates.map((cert, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "carousel__indicador";
    button.setAttribute("aria-label", `Ir para o certificado ${index + 1}: ${cert.title}`);
    button.addEventListener("click", () => goTo(index));
    indicatorsContainer.appendChild(button);
    return button;
  });

  function render(): void {
    cardElements.forEach((el, index) => {
      const state = getState(index, activeIndex, total);
      const link = el.querySelector<HTMLAnchorElement>(".cert-card__link");
      el.dataset.state = state;
      el.setAttribute("aria-hidden", state === "active" ? "false" : "true");
      if (link) link.tabIndex = state === "active" ? 0 : -1;
    });
    indicatorButtons.forEach((button, index) => {
      button.setAttribute("aria-current", String(index === activeIndex));
    });
  }

  function goTo(index: number): void {
    activeIndex = ((index % total) + total) % total;
    render();
  }

  function next(): void {
    goTo(activeIndex + 1);
  }

  function prev(): void {
    goTo(activeIndex - 1);
  }

  nextButton.addEventListener("click", next);
  prevButton.addEventListener("click", prev);

  // --- autoplay, com motivos de pausa explícitos ---
  //
  // Em vez de startAutoplay()/stopAutoplay() espalhados (e arriscando dois
  // setInterval simultâneos, ou o hover "roubar" uma pausa que devia ser
  // do IntersectionObserver), guardo o CONJUNTO de motivos ativos agora.
  // O autoplay só roda de verdade quando esse conjunto está vazio — uma
  // única fonte de verdade para "deveria estar rodando?", em vez de cada
  // evento decidir sozinho.
  let autoplayId: number | undefined;
  const pauseReasons = new Set<string>(["offscreen"]); // começa parado até o observer confirmar visibilidade

  function startAutoplay(): void {
    if (autoplayId !== undefined) return; // já rodando — nunca cria um segundo interval
    autoplayId = window.setInterval(next, AUTOPLAY_INTERVAL_MS);
  }

  function stopAutoplay(): void {
    if (autoplayId === undefined) return;
    window.clearInterval(autoplayId);
    autoplayId = undefined;
  }

  function syncAutoplay(): void {
    if (pauseReasons.size === 0) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }

  function pause(reason: string): void {
    pauseReasons.add(reason);
    syncAutoplay();
  }

  function resume(reason: string): void {
    pauseReasons.delete(reason);
    syncAutoplay();
  }

  section.addEventListener("mouseenter", () => pause("hover"));
  section.addEventListener("mouseleave", () => resume("hover"));
  section.addEventListener("focusin", () => pause("focus"));
  section.addEventListener("focusout", (event) => {
    // só retoma se o foco saiu de vez da seção, não pulou entre dois controles dela
    if (!section.contains(event.relatedTarget as Node | null)) {
      resume("focus");
    }
  });

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        resume("offscreen");
      } else {
        pause("offscreen");
      }
    },
    // 40% visível: o suficiente para presumir que a pessoa está realmente
    // olhando para o carrossel, sem ser tão sensível a ponto de pausar e
    // retomar a cada pequeno ajuste de rolagem perto da borda da seção
    { threshold: 0.4 }
  );
  visibilityObserver.observe(section);

  render();
}
