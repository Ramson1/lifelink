/**
 * Renders schema.org structured data as a JSON-LD <script> block.
 * Accepts a single node or an array of nodes (each already carrying its own
 * "@context"), which is valid JSON-LD and read by search / answer engines.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
