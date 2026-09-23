type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Injects a schema.org payload as a <script type="application/ld+json">. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
