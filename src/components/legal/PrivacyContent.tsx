'use client'

import { useLang } from '@/lib/i18n/context'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-ink mb-3">{title}</h2>
      <div className="text-[14px] text-stone leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

function EN() {
  return (
    <>
      <Section title="Who We Are">
        <p>Anagrama Art in Knots is a handmade goods brand operated by Ana, based in Portugal. We sell handcrafted crochet amigurumis and accessories directly to customers worldwide.</p>
        <p>Contact: <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a></p>
      </Section>

      <Section title="What Data We Collect">
        <p>When you place an order, we collect your name, email address, shipping address, and payment information. Payment data is processed directly by Stripe — we never see or store your card details.</p>
        <p>When you submit a contact or commission form, we collect your name, email address, and the content of your message.</p>
        <p>When you visit the site, our hosting provider (Vercel) may collect standard server logs including IP addresses and browser information for security and performance purposes.</p>
      </Section>

      <Section title="Why We Use Your Data">
        <p>We use your data to: fulfil and ship your order; send you an order confirmation email; respond to your enquiries; and comply with our legal and tax obligations.</p>
        <p>We do not use your data for marketing without your explicit consent.</p>
      </Section>

      <Section title="Who We Share Data With">
        <p>We share your data only with the third-party services necessary to operate the business:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong className="text-ink">Stripe</strong> — payment processing (stripe.com)</li>
          <li><strong className="text-ink">Resend</strong> — transactional email delivery (resend.com)</li>
          <li><strong className="text-ink">Supabase</strong> — database and file storage (supabase.com)</li>
          <li><strong className="text-ink">Vercel</strong> — website hosting (vercel.com)</li>
        </ul>
        <p>We do not sell, rent, or trade your personal data to any third parties.</p>
      </Section>

      <Section title="How Long We Keep Your Data">
        <p>Order data (name, address, purchase history) is retained for 5 years to comply with Portuguese tax law.</p>
        <p>Contact and commission form submissions are retained for up to 2 years.</p>
        <p>You may request deletion at any time — see "Your Rights" below.</p>
      </Section>

      <Section title="Cookies">
        <p>We use only essential cookies required for the site to function. Stripe, our payment provider, sets its own cookies during the checkout process for fraud prevention and security.</p>
        <p>We do not use advertising or tracking cookies.</p>
      </Section>

      <Section title="Your Rights (GDPR)">
        <p>If you are in the European Economic Area, you have the right to:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data ("right to be forgotten")</li>
          <li>Request a portable copy of your data</li>
          <li>Object to processing or withdraw consent</li>
          <li>Lodge a complaint with the Portuguese data protection authority (CNPD — cnpd.pt)</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a>. We will respond within 30 days.</p>
      </Section>

      <Section title="Changes to This Policy">
        <p>We may update this policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance.</p>
      </Section>
    </>
  )
}

function PT() {
  return (
    <>
      <Section title="Quem Somos">
        <p>Anagrama Art in Knots é uma marca de artesanato operada pela Ana, com sede em Portugal. Vendemos amigurumis e acessórios de crochet feitos à mão diretamente a clientes em todo o mundo.</p>
        <p>Contacto: <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a></p>
      </Section>

      <Section title="Que Dados Recolhemos">
        <p>Quando fazes uma encomenda, recolhemos o teu nome, endereço de email, morada de envio e informações de pagamento. Os dados de pagamento são processados diretamente pelo Stripe — nunca vemos nem guardamos os detalhes do teu cartão.</p>
        <p>Quando submetes um formulário de contacto ou encomenda personalizada, recolhemos o teu nome, endereço de email e o conteúdo da tua mensagem.</p>
        <p>Quando visitas o site, o nosso fornecedor de alojamento (Vercel) pode recolher registos de servidor padrão, incluindo endereços IP e informações do browser, para fins de segurança e desempenho.</p>
      </Section>

      <Section title="Para Que Usamos os Teus Dados">
        <p>Usamos os teus dados para: preparar e enviar a tua encomenda; enviar um email de confirmação; responder às tuas questões; e cumprir as nossas obrigações legais e fiscais.</p>
        <p>Não usamos os teus dados para fins de marketing sem o teu consentimento explícito.</p>
      </Section>

      <Section title="Com Quem Partilhamos os Dados">
        <p>Partilhamos os teus dados apenas com os serviços de terceiros necessários para operar o negócio:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong className="text-ink">Stripe</strong> — processamento de pagamentos (stripe.com)</li>
          <li><strong className="text-ink">Resend</strong> — envio de emails transacionais (resend.com)</li>
          <li><strong className="text-ink">Supabase</strong> — base de dados e armazenamento de ficheiros (supabase.com)</li>
          <li><strong className="text-ink">Vercel</strong> — alojamento do website (vercel.com)</li>
        </ul>
        <p>Não vendemos, alugamos nem cedemos os teus dados pessoais a terceiros.</p>
      </Section>

      <Section title="Por Quanto Tempo Guardamos os Dados">
        <p>Os dados de encomendas (nome, morada, histórico de compras) são retidos durante 5 anos para cumprir a legislação fiscal portuguesa.</p>
        <p>As submissões de formulários de contacto e encomenda personalizada são retidas até 2 anos.</p>
        <p>Podes solicitar a eliminação a qualquer momento — ver "Os Teus Direitos" abaixo.</p>
      </Section>

      <Section title="Cookies">
        <p>Utilizamos apenas cookies essenciais necessários para o funcionamento do site. O Stripe, o nosso fornecedor de pagamentos, define os seus próprios cookies durante o processo de checkout para prevenção de fraude e segurança.</p>
        <p>Não utilizamos cookies de publicidade ou rastreamento.</p>
      </Section>

      <Section title="Os Teus Direitos (RGPD)">
        <p>Se te encontras no Espaço Económico Europeu, tens o direito de:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Aceder aos dados pessoais que detemos sobre ti</li>
          <li>Corrigir dados incorretos</li>
          <li>Solicitar a eliminação dos teus dados ("direito ao esquecimento")</li>
          <li>Solicitar uma cópia portátil dos teus dados</li>
          <li>Opor-te ao tratamento ou retirar o consentimento</li>
          <li>Apresentar uma reclamação à autoridade portuguesa de proteção de dados (CNPD — cnpd.pt)</li>
        </ul>
        <p>Para exercer qualquer destes direitos, envia-nos um email para <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a>. Responderemos no prazo de 30 dias.</p>
      </Section>

      <Section title="Alterações a Esta Política">
        <p>Podemos atualizar esta política de tempos a tempos. A data no topo desta página indica a revisão mais recente. A utilização continuada do site após alterações constitui aceitação.</p>
      </Section>
    </>
  )
}

export default function PrivacyContent() {
  const { lang, t } = useLang()

  return (
    <main className="pt-36 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-teal mb-3">※ {lang === 'pt' ? 'Legal' : 'Legal'}</p>
        <h1 className="text-3xl font-semibold text-ink mb-2">{t.footer.privacy}</h1>
        <p className="text-[12px] text-stone mb-12">{lang === 'pt' ? 'Última atualização: abril de 2025' : 'Last updated: April 2025'}</p>

        {lang === 'pt' ? <PT /> : <EN />}
      </div>
    </main>
  )
}
