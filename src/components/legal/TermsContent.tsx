'use client'

import Eyebrow from '@/components/ui/Eyebrow'
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
      <Section title="About Us">
        <p>Anagrama Art in Knots is a handmade goods brand operated by Ana, based in Portugal. By placing an order or using this website, you agree to these Terms & Conditions.</p>
      </Section>

      <Section title="Our Products">
        <p>All pieces are handmade, one of a kind, and crocheted by Ana alone. Because each item is made by hand, there may be minor variations in colour, texture, or size compared to product photographs — this is a feature, not a flaw.</p>
        <p>Product descriptions and photographs are as accurate as possible. If you have any questions before purchasing, please contact us.</p>
      </Section>

      <Section title="Pricing & Payment">
        <p>All prices are shown in Euros (EUR). Currency conversion at checkout is indicative only — your bank or card provider may apply their own exchange rate.</p>
        <p>Payment is processed securely by Stripe. We accept all major credit and debit cards. Payment is taken at the time of order.</p>
      </Section>

      <Section title="Order Acceptance">
        <p>Placing an order constitutes an offer to purchase. Your order is only accepted once payment is confirmed and you receive an order confirmation email from us.</p>
        <p>We reserve the right to refuse or cancel any order, for example if a product is no longer available or if we suspect fraudulent activity.</p>
      </Section>

      <Section title="Shipping">
        <p>Orders are shipped from Portugal. Delivery times and shipping costs are set out on our <a href="/shipping" className="text-teal underline underline-offset-2">shipping page</a>.</p>
        <p>Risk of loss passes to the buyer upon delivery of the order to the carrier. For orders outside the EU, the buyer is responsible for any customs duties or import taxes.</p>
      </Section>

      <Section title="Custom & Commission Orders">
        <p>Commission pieces are made specifically for you following a conversation with Ana. Once a commission is accepted and work has begun, it cannot be cancelled.</p>
        <p>Custom and made-to-order items are exempt from the EU right of withdrawal under Article 16(c) of Directive 2011/83/EU.</p>
      </Section>

      <Section title="Intellectual Property">
        <p>All photographs, designs, brand assets, and written content on this website are the property of Anagrama Art in Knots. You may not reproduce, copy, or distribute any content without written permission.</p>
      </Section>

      <Section title="Limitation of Liability">
        <p>To the maximum extent permitted by law, Anagrama Art in Knots shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
        <p>Our total liability for any claim shall not exceed the price paid for the product in question.</p>
      </Section>

      <Section title="Governing Law">
        <p>These Terms are governed by the laws of Portugal. Any disputes shall be subject to the exclusive jurisdiction of the Portuguese courts.</p>
      </Section>

      <Section title="Contact">
        <p>Questions about these Terms? Email us at <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a>.</p>
      </Section>
    </>
  )
}

function PT() {
  return (
    <>
      <Section title="Sobre Nós">
        <p>Anagrama Art in Knots é uma marca de artesanato operada pela Ana, com sede em Portugal. Ao fazer uma encomenda ou utilizar este website, aceitas estes Termos e Condições.</p>
      </Section>

      <Section title="Os Nossos Produtos">
        <p>Todas as peças são feitas à mão, únicas, e crochetadas pela Ana. Como cada peça é feita manualmente, podem existir pequenas variações de cor, textura ou tamanho em relação às fotografias — isto é uma característica, não um defeito.</p>
        <p>As descrições e fotografias dos produtos são tão precisas quanto possível. Se tiveres alguma dúvida antes de comprar, contacta-nos.</p>
      </Section>

      <Section title="Preços e Pagamento">
        <p>Todos os preços são apresentados em Euros (EUR). A conversão de moeda no checkout é indicativa — o teu banco ou fornecedor de cartão pode aplicar a sua própria taxa de câmbio.</p>
        <p>O pagamento é processado de forma segura pelo Stripe. Aceitamos todos os principais cartões de crédito e débito. O pagamento é cobrado no momento da encomenda.</p>
      </Section>

      <Section title="Aceitação de Encomendas">
        <p>Fazer uma encomenda constitui uma oferta de compra. A tua encomenda só é aceite após confirmação do pagamento e recebimento de um email de confirmação da nossa parte.</p>
        <p>Reservamo-nos o direito de recusar ou cancelar qualquer encomenda, por exemplo se um produto deixar de estar disponível ou se suspeitarmos de atividade fraudulenta.</p>
      </Section>

      <Section title="Envios">
        <p>As encomendas são enviadas de Portugal. Os prazos de entrega e custos de envio estão detalhados na nossa <a href="/shipping" className="text-teal underline underline-offset-2">página de envios</a>.</p>
        <p>O risco de perda passa para o comprador após entrega da encomenda à transportadora. Para encomendas fora da UE, o comprador é responsável por eventuais taxas alfandegárias ou impostos de importação.</p>
      </Section>

      <Section title="Encomendas Personalizadas">
        <p>As peças de encomenda são feitas especificamente para ti, após uma conversa com a Ana. Uma vez aceite a encomenda e iniciado o trabalho, não é possível cancelar.</p>
        <p>Os artigos personalizados ou feitos a pedido estão isentos do direito de arrependimento da UE, nos termos do artigo 16.º, alínea c), da Diretiva 2011/83/UE.</p>
      </Section>

      <Section title="Propriedade Intelectual">
        <p>Todas as fotografias, designs, ativos da marca e conteúdo escrito neste website são propriedade da Anagrama Art in Knots. Não podes reproduzir, copiar ou distribuir qualquer conteúdo sem autorização por escrito.</p>
      </Section>

      <Section title="Limitação de Responsabilidade">
        <p>Na máxima extensão permitida por lei, a Anagrama Art in Knots não será responsável por quaisquer danos indiretos, incidentais ou consequenciais decorrentes da utilização dos nossos produtos ou website.</p>
        <p>A nossa responsabilidade total por qualquer reclamação não excederá o preço pago pelo produto em questão.</p>
      </Section>

      <Section title="Lei Aplicável">
        <p>Estes Termos são regidos pela lei portuguesa. Qualquer litígio ficará sujeito à jurisdição exclusiva dos tribunais portugueses.</p>
      </Section>

      <Section title="Contacto">
        <p>Dúvidas sobre estes Termos? Envia-nos um email para <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a>.</p>
      </Section>
    </>
  )
}

export default function TermsContent() {
  const { lang, t } = useLang()

  return (
    <main className="pt-36 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <Eyebrow className="text-[11px] tracking-[0.3em] uppercase text-teal mb-3">Legal</Eyebrow>
        <h1 className="text-3xl font-semibold text-ink mb-2">{t.footer.terms}</h1>
        <p className="text-[12px] text-stone mb-12">{lang === 'pt' ? 'Última atualização: abril de 2025' : 'Last updated: April 2025'}</p>

        {lang === 'pt' ? <PT /> : <EN />}
      </div>
    </main>
  )
}
