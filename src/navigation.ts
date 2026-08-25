// navigation.ts
//
// Tudo relacionado ao COMPORTAMENTO do menu lateral vive aqui: abrir/fechar
// no mobile, e destacar o link da seção que está em foco durante a rolagem.
//
// Por que separado do main.ts: esta já é uma responsabilidade completa e
// independente — não depende de mais nada no projeto além do próprio menu.
// Deixar isso dentro de main.ts começaria a repetir exatamente o problema
// identificado na auditoria do projeto antigo (um arquivo só acumulando
// funcionalidades sem relação entre si). Quando uma próxima funcionalidade
// (formulário, carrossel) precisar de lógica própria, ela ganha seu próprio
// arquivo — não volta a entrar aqui nem em main.ts.

const ACTIVE_LINK_CLASS = "sidebar__link--ativo";
const MENU_OPEN_CLASS = "is-open";
const BODY_SCROLL_LOCK_CLASS = "menu-aberto";

/**
 * Botão hambúrguer: abre/fecha a sidebar no mobile.
 * TypeScript decide QUANDO o estado muda (clique no botão, clique num link);
 * o CSS decide COMO isso aparece (classe .is-open, atributo aria-expanded).
 */
function setupMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>("#menu-toggle");
  const sidebar = document.querySelector<HTMLElement>("#sidebar");

  if (!toggle || !sidebar) return;

  const setOpen = (open: boolean): void => {
    toggle.setAttribute("aria-expanded", String(open));
    sidebar.classList.toggle(MENU_OPEN_CLASS, open);
    document.body.classList.toggle(BODY_SCROLL_LOCK_CLASS, open);
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // fecha o menu ao escolher qualquer opção (também no desktop não faz
  // diferença, pois lá a sidebar já é sempre visível)
  sidebar.querySelectorAll<HTMLAnchorElement>("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

/**
 * Destaque da seção ativa: observa as <section> do <main> e marca o link
 * correspondente do menu com a classe ativa.
 */
function setupScrollSpy(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");

  interface Item {
    id: string;
    link: HTMLAnchorElement;
    section: HTMLElement;
  }

  const items: Item[] = [];

  navLinks.forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    const section = id ? document.getElementById(id) : null;
    if (id && section) {
      items.push({ id, link, section });
    }
  });

  if (items.length === 0) return;

  // ids atualmente dentro da "faixa de detecção" (ver rootMargin abaixo)
  const visibleIds = new Set<string>();

  const updateActiveLink = (): void => {
  const visibleItems = items.filter((item) => visibleIds.has(item.id));

  if (visibleItems.length === 0) return;

  const detectionPoint = window.innerHeight * 0.15;

  const current = visibleItems.reduce((closest, item) => {
    const closestDistance = Math.abs(
      closest.section.getBoundingClientRect().top - detectionPoint
    );

    const itemDistance = Math.abs(
      item.section.getBoundingClientRect().top - detectionPoint
    );

    return itemDistance < closestDistance ? item : closest;
  });

  items.forEach((item) => {
    item.link.classList.toggle(
      ACTIVE_LINK_CLASS,
      item.id === current.id
    );
  });
};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting) {
          visibleIds.add(id);
        } else {
          visibleIds.delete(id);
        }
      });

      const handlePageEnd = (): void => {
  const reachedBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 10;

  if (!reachedBottom) return;

  const lastItem = items[items.length - 1];

  items.forEach((item) => {
    item.link.classList.toggle(
      ACTIVE_LINK_CLASS,
      item.id === lastItem.id
    );
  });
};

window.addEventListener("scroll", handlePageEnd);

      updateActiveLink();
    },
    {
      root: null,
      // Faixa estreita perto do topo (15%–30% da viewport) em vez do
      // threshold padrão sobre a viewport inteira. Com seções mais altas
      // que a tela (como "Sobre mim"), um threshold como 0.5 nunca
      // dispararia; esta faixa define "ativa" como "está passando pela
      // região onde os olhos normalmente leem", o que funciona igual
      // para seções curtas ou longas.
      rootMargin: "-15% 0px -70% 0px",
      threshold: 0,
    }
  );

  items.forEach((item) => observer.observe(item.section));
}

export function initNavigation(): void {
  setupMobileMenu();
  setupScrollSpy();
}
