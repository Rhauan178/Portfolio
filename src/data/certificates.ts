// data/certificates.ts
//
// Fonte única dos dados de certificados. Cada campo vem só do que está
// realmente escrito (ou codificado, no caso do QR) nos PDFs originais em
// public/certificates/ — nada foi inventado. Onde um dado não existia
// claramente em um certificado específico, o campo opcional correspondente
// simplesmente fica de fora daquele objeto (ver comentários abaixo).

export interface Certificate {
  /** Identificador simples, usado como key/posição — não precisa ser o id do emissor. */
  id: number;
  /** Nome do curso/evento, como escrito no certificado. Único campo sempre obrigatório. */
  title: string;
  /** Instituição/organização emissora — opcional porque nem todo certificado imprime uma. */
  institution?: string;
  /** Data de emissão, só quando impressa no próprio certificado (não metadado de arquivo). */
  date?: string;
  /** Carga horária, só quando informada. */
  workload?: string;
  /** Descrição curta do conteúdo/projeto, só quando o certificado detalha isso. */
  description?: string;
  /** Link de verificação, só quando existe (aqui, extraído de um QR real). */
  validationUrl?: string;
  /** Caminho da imagem de preview (não o PDF inteiro). */
  image: string;
  /** Caminho do PDF original. */
  pdf: string;
}

export const certificates: Certificate[] = [
  {
    id: 1,
    title: "Introduction to Cybersecurity",
    institution: "Cisco Networking Academy",
    date: "20 de março de 2026",
    // extraído decodificando o QR "Scan to Verify" impresso no certificado —
    // não veio de nenhum texto selecionável do PDF
    validationUrl: "https://www.credly.com/badges/ba3048b5-b29c-44b7-9f67-c34731344ee4",
    image: "/certificates/previews/cisco-introduction-to-cybersecurity.webp",
    pdf: "/certificates/cisco-introduction-to-cybersecurity.pdf",
  },
  {
    id: 2,
    title: "Full Stack Weekend",
    workload: "12 horas",
    description:
      "Desenvolvimento de um SaaS de agendamentos para barbearias, do zero ao deploy.",
    // sem "date": o PDF não imprime nenhuma data no certificado — só existe uma
    // data técnica de geração do arquivo nos metadados, que não é a mesma coisa
    image: "/certificates/previews/full-stack-weekend.webp",
    pdf: "/certificates/full-stack-weekend.pdf",
  },
];
