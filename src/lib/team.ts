import "server-only";
import fs from "node:fs";
import path from "node:path";

export type TeamLevel = "ceo" | "director" | "manager" | "other";

export interface TeamMember {
  name: string;
  position: string;
  image: string; // public URL path, e.g. /team/foo.png
  level: TeamLevel;
}

/** Classify a team member's hierarchy level from their position string. */
export function classifyLevel(position: string): TeamLevel {
  if (/chairman|director general|ceo|president/i.test(position)) return "ceo";
  if (/director/i.test(position)) return "director";
  if (/manager|head of/i.test(position)) return "manager";
  return "other";
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
      // Append the file's mtime as a cache-buster so a replaced photo (same
      // filename) always yields a fresh URL and defeats the Next image
      // optimizer + browser caches.
      let version = "";
      try {
        version = Math.floor(fs.statSync(path.join(dir, file)).mtimeMs).toString(36);
      } catch {
        version = "";
      }
      members.push({
        name: parsed.name,
        position: parsed.position,
        image: `/team/${encodeURIComponent(file)}${version ? `?v=${version}` : ""}`,
        level: classifyLevel(parsed.position),
      });
    }

    // Stable order: CEO first, then directors, then managers, then others
    const levelOrder: Record<TeamLevel, number> = { ceo: 0, director: 1, manager: 2, other: 3 };
    members.sort((a, b) => {
      const diff = levelOrder[a.level] - levelOrder[b.level];
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });

    return members;
  } catch (err) {
    console.error("Failed to list team members", err);
    return [];
  }
}
