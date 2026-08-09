import "server-only";
import fs from "node:fs";
import path from "node:path";

export interface TeamMember {
  name: string;
  position: string;
  image: string; // public URL path, e.g. /team/foo.png
}

/**
 * Parse team filenames of the form:
 *   "<name> <position>.png"
 * where the position starts with a capital letter and the name portion is
 * everything before that capital. We treat the LAST capital-letter run that
 * follows a space as the split point.
 */
/** Capitalise every word of a string. */
function capitalise(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

function parseFilename(filename: string): { name: string; position: string } | null {
  const base = filename.replace(/\.(png|jpe?g|webp)$/i, "");
  // Find the split: last occurrence of " X" where X is an uppercase letter
  // followed by lowercase or space (i.e. start of a word).
  const match = base.match(/^(.*)\s+([A-Z][A-Za-z\s,.'&/-]*)$/);
  if (!match) return null;
  const name = capitalise(match[1].trim());
  const position = match[2].trim();
  if (!name || !position) return null;
  return { name, position };
}

/**
 * Read all team images from public/team and return parsed members.
 * Safe to call on the server — returns [] if the folder is missing.
 */
export function listTeamMembers(): TeamMember[] {
  try {
    const dir = path.join(process.cwd(), "public", "team");
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

    const members: TeamMember[] = [];
    for (const file of files) {
      const parsed = parseFilename(file);
      if (!parsed) continue;
      members.push({
        name: parsed.name,
        position: parsed.position,
        image: `/team/${encodeURIComponent(file)}`,
      });
    }

    // Stable order: chairman first, then alphabetical by name
    members.sort((a, b) => {
      const aChair = /chairman|director general/i.test(a.position) ? 0 : 1;
      const bChair = /chairman|director general/i.test(b.position) ? 0 : 1;
      if (aChair !== bChair) return aChair - bChair;
      return a.name.localeCompare(b.name);
    });

    return members;
  } catch (err) {
    console.error("Failed to list team members", err);
    return [];
  }
}
