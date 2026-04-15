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
      <Section title="Right of Withdrawal (EU Customers)">
        <p>If you are based in the European Union, you have the right to withdraw from your purchase within <strong className="text-ink">14 days</strong> of receiving your order, without giving any reason.</p>
        <p>To exercise this right, contact us at <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a> within 14 days of delivery, stating your order number and your intention to return.</p>
      </Section>

      <Section title="Exceptions — Custom & Made-to-Order Pieces">
        <p>The right of withdrawal does not apply to items that are made to the consumer's specifications or clearly personalised. This includes all commission and made-to-order pieces.</p>
        <p>By placing a commission order, you acknowledge and accept this exception.</p>
      </Section>

      <Section title="How to Return">
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>Email us at <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a> within 14 days of delivery</li>
          <li>Include your order number and reason for return</li>
          <li>We will confirm the return and provide the shipping address</li>
          <li>Send the item back unused, in its original packaging, within 14 days of our confirmation</li>
        </ol>
      </Section>

      <Section title="Condition of Returned Items">
        <p>Items must be returned unused, unwashed, and in their original condition and packaging. We reserve the right to refuse a refund if the item shows signs of use or damage not caused by us.</p>
      </Section>

      <Section title="Return Shipping Costs">
        <p>The cost of return shipping is the buyer's responsibility unless the item arrived damaged or incorrect.</p>
        <p>We recommend using a tracked shipping service — we cannot be responsible for items lost in transit.</p>
      </Section>

      <Section title="Refunds">
        <p>Once we receive and inspect the returned item, we will process your refund within <strong className="text-ink">14 days</strong>. The refund will be issued to the original payment method.</p>
        <p>We will refund the full item price. Original shipping costs are only refunded if the return is due to our error or a faulty item.</p>
      </Section>

      <Section title="Damaged or Incorrect Items">
        <p>If your order arrives damaged or you received the wrong item, please contact us within <strong className="text-ink">48 hours</strong> of delivery with your order number and a photograph. We will resolve it promptly at no cost to you.</p>
        <p>Email: <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a></p>
      </Section>
    </>
  )
}

function PT() {
  return (
    <>
      <Section title="Direito de Arrependimento (Clientes da UE)">
        <p>Se estás na União Europeia, tens o direito de desistir da tua compra no prazo de <strong className="text-ink">14 dias</strong> após receberes a tua encomenda, sem necessidade de justificação.</p>
        <p>Para exercer este direito, contacta-nos em <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a> no prazo de 14 dias após a entrega, indicando o número da encomenda e a intenção de devolver.</p>
      </Section>

      <Section title="Exceções — Peças Personalizadas e Feitas a Pedido">
        <p>O direito de arrependimento não se aplica a artigos feitos de acordo com as especificações do consumidor ou claramente personalizados. Isto inclui todas as peças de encomenda e feitas a pedido.</p>
        <p>Ao fazer uma encomenda personalizada, reconheces e aceitas esta exceção.</p>
      </Section>

      <Section title="Como Devolver">
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>Envia-nos um email para <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a> no prazo de 14 dias após a entrega</li>
          <li>Inclui o número da encomenda e o motivo da devolução</li>
          <li>Confirmamos a devolução e fornecemos a morada de envio</li>
          <li>Envia o artigo sem uso, na embalagem original, no prazo de 14 dias após a nossa confirmação</li>
        </ol>
      </Section>

      <Section title="Condição dos Artigos Devolvidos">
        <p>Os artigos devem ser devolvidos sem uso, não lavados e em condições originais com a embalagem intacta. Reservamo-nos o direito de recusar o reembolso se o artigo mostrar sinais de uso ou danos não causados por nós.</p>
      </Section>

      <Section title="Custos de Envio de Devolução">
        <p>Os custos de envio da devolução são da responsabilidade do comprador, salvo se o artigo chegou danificado ou incorreto.</p>
        <p>Recomendamos o uso de um serviço com rastreamento — não nos responsabilizamos por artigos perdidos durante o transporte.</p>
      </Section>

      <Section title="Reembolsos">
        <p>Após recebermos e inspecionarmos o artigo devolvido, processaremos o teu reembolso no prazo de <strong className="text-ink">14 dias</strong>. O reembolso será efetuado para o método de pagamento original.</p>
        <p>Reembolsamos o valor total do artigo. Os custos de envio originais só são reembolsados se a devolução se dever a um erro nosso ou a um artigo com defeito.</p>
      </Section>

      <Section title="Artigos Danificados ou Incorretos">
        <p>Se a tua encomenda chegou danificada ou recebeste o artigo errado, contacta-nos nas <strong className="text-ink">48 horas</strong> seguintes à entrega, com o número da encomenda e uma fotografia. Resolveremos prontamente sem qualquer custo para ti.</p>
        <p>Email: <a href="mailto:anagramaknots@gmail.com" className="text-teal underline underline-offset-2">anagramaknots@gmail.com</a></p>
      </Section>
    </>
  )
}

export default function ReturnsContent() {
  const { lang, t } = useLang()

  return (
    <main className="pt-36 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <Eyebrow className="text-[11px] tracking-[0.3em] uppercase text-teal mb-3">Legal</Eyebrow>
        <h1 className="text-3xl font-semibold text-ink mb-2">{t.footer.returns}</h1>
        <p className="text-[12px] text-stone mb-12">{lang === 'pt' ? 'Última atualização: abril de 2025' : 'Last updated: April 2025'}</p>

        {lang === 'pt' ? <PT /> : <EN />}
      </div>
    </main>
  )
}
