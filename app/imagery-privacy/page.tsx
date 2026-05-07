export const metadata = { title: "Imagery & privacy · Plot" };

export default function ImageryPrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
      <p className="legend mb-6">/ Imagery & privacy</p>
      <h1 className="mb-12">How we use<br />satellite imagery.</h1>

      <div className="space-y-10 text-lg leading-relaxed">
        <Section title="Imagery sources">
          We work with two satellite-imagery providers. <strong>Mapbox</strong>{" "}
          (commercial high-resolution z=20 tiles) is the input to our detection
          model — what the model sees, you see on every lead row.{" "}
          <strong>NAIP</strong> (USDA National Agriculture Imagery Program,
          public domain) is what we use for marketing and overview maps.
        </Section>

        <Section title="What we do show">
          A satellite image of the parcel where we detected a pool, exactly as
          it appears in current commercial imagery. The same picture you'd see
          if you typed the address into a mapping app.
        </Section>

        <Section title="What we don't show">
          We don't pull, infer, or sell occupant data, household demographics,
          or anything beyond what the assessor's office already publishes plus
          what the satellite sees. No phone numbers. No email addresses. No
          inferred household composition.
        </Section>

        <Section title="Owner & address data">
          Owner name and mailing address come from the county assessor — they
          are public record in every state we operate in. We forward what's
          published; we don't enrich it.
        </Section>

        <Section title="Refund as accountability">
          Our refund policy isn't just a sales offer. It's how we hold ourselves
          accountable to the imagery's accuracy. If the photo doesn't show a
          pool, we don't think we should be paid for that record — full stop.
        </Section>

        <Section title="Imagery freshness">
          Mapbox imagery is refreshed continuously across most US metros — most
          tiles are within 12 months. We surface the imagery date on every
          row when the provider exposes it.
        </Section>

        <Section title="Property opt-outs">
          If you're a property owner and want your address removed from our
          delivered lists, email{" "}
          <a href="mailto:hello@get-plot.com" className="underline">
            hello@get-plot.com
          </a>
          . We honor opt-outs within 7 days and apply them retroactively to all
          future scans.
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-4">{title}</h3>
      <p>{children}</p>
    </section>
  );
}
