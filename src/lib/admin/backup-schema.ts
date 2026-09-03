/**
 * Declarative registry describing every database table covered by the
 * backup/restore system. This is the single source of truth for:
 *  - which columns to export (and their order),
 *  - how to coerce CSV strings back into typed values on import,
 *  - the FK-safe import order,
 *  - the upsert conflict target for each entity.
 *
 * Columns mirror the migrations in `supabase/migrations/`.
 */

export type ColumnType =
  | "uuid"
  | "text"
  | "boolean"
  | "integer"
  | "numeric"
  | "timestamptz"
  | "jsonb";

export interface EntitySchema {
  /** Physical table name. */
  table: string;
  /** Human-friendly label for the UI. */
  label: string;
  /** Ordered column list (defines CSV header). */
  columns: string[];
  /** Column -> type map used for import coercion. */
  types: Record<string, ColumnType>;
  /** Primary key column (used for stable export ordering). */
  primaryKey: string;
  /** Column(s) used as the upsert conflict target. */
  conflictTarget: string;
  /** Columns that may be NULL (empty CSV cell -> null). */
  nullable: string[];
  /** True when the entity contains secrets (e.g. password hashes). */
  sensitive?: boolean;
}

export const BACKUP_ENTITIES: EntitySchema[] = [
  {
    table: "lifelink_admins",
    label: "Admins",
    columns: [
      "id",
      "email",
      "password_hash",
      "full_name",
      "role",
      "is_super_admin",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      email: "text",
      password_hash: "text",
      full_name: "text",
      role: "text",
      is_super_admin: "boolean",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "email",
    nullable: [],
    sensitive: true,
  },
  {
    table: "lifelink_users",
    label: "Users",
    columns: [
      "id",
      "full_name",
      "email",
      "phone",
      "address",
      "occupation",
      "next_of_kin_name",
      "next_of_kin_phone",
      "service_key",
      "notes",
      "status",
      "source",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      full_name: "text",
      email: "text",
      phone: "text",
      address: "text",
      occupation: "text",
      next_of_kin_name: "text",
      next_of_kin_phone: "text",
      service_key: "text",
      notes: "text",
      status: "text",
      source: "text",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["occupation", "next_of_kin_name", "next_of_kin_phone"],
  },
  {
    table: "lifelink_content",
    label: "Content",
    columns: ["id", "key", "value", "updated_by", "updated_at"],
    types: {
      id: "uuid",
      key: "text",
      value: "text",
      updated_by: "uuid",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "key",
    nullable: ["updated_by"],
  },
  {
    table: "lifelink_sectors",
    label: "Sectors",
    columns: [
      "id",
      "key",
      "title",
      "subtitle",
      "description",
      "icon",
      "color_from",
      "color_to",
      "tagline",
      "overview",
      "features",
      "benefits",
      "is_active",
      "accepting_registrations",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      key: "text",
      title: "text",
      subtitle: "text",
      description: "text",
      icon: "text",
      color_from: "text",
      color_to: "text",
      tagline: "text",
      overview: "jsonb",
      features: "jsonb",
      benefits: "jsonb",
      is_active: "boolean",
      accepting_registrations: "boolean",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "key",
    nullable: [],
  },
  {
    table: "lifelink_fundraisers",
    label: "Fundraisers",
    columns: [
      "id",
      "title",
      "description",
      "sector",
      "target_amount",
      "current_amount",
      "image_url",
      "is_active",
      "starts_at",
      "ends_at",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      title: "text",
      description: "text",
      sector: "text",
      target_amount: "numeric",
      current_amount: "numeric",
      image_url: "text",
      is_active: "boolean",
      starts_at: "timestamptz",
      ends_at: "timestamptz",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["starts_at", "ends_at"],
  },
  {
    table: "lifelink_partners",
    label: "Partners",
    columns: [
      "id",
      "name",
      "logo_url",
      "website_url",
      "category",
      "sort_order",
      "is_active",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      name: "text",
      logo_url: "text",
      website_url: "text",
      category: "text",
      sort_order: "integer",
      is_active: "boolean",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["logo_url", "website_url"],
  },
  {
    table: "lifelink_events",
    label: "Events",
    columns: [
      "id",
      "title",
      "description",
      "location",
      "event_date",
      "image_url",
      "is_upcoming",
      "is_active",
      "sort_order",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      title: "text",
      description: "text",
      location: "text",
      event_date: "timestamptz",
      image_url: "text",
      is_upcoming: "boolean",
      is_active: "boolean",
      sort_order: "integer",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["event_date", "image_url"],
  },
  {
    table: "lifelink_certificates",
    label: "Certificates",
    columns: [
      "id",
      "title",
      "subtitle",
      "image_url",
      "icon_emoji",
      "sort_order",
      "is_active",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      title: "text",
      subtitle: "text",
      image_url: "text",
      icon_emoji: "text",
      sort_order: "integer",
      is_active: "boolean",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["image_url"],
  },
  {
    table: "lifelink_gallery",
    label: "Gallery",
    columns: [
      "id",
      "image_url",
      "caption",
      "category",
      "sort_order",
      "is_active",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      image_url: "text",
      caption: "text",
      category: "text",
      sort_order: "integer",
      is_active: "boolean",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: [],
  },
  {
    table: "lifelink_faqs",
    label: "FAQs",
    columns: [
      "id",
      "question",
      "answer",
      "category",
      "sort_order",
      "is_published",
      "created_at",
      "updated_at",
    ],
    types: {
      id: "uuid",
      question: "text",
      answer: "text",
      category: "text",
      sort_order: "integer",
      is_published: "boolean",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: [],
  },
  {
    table: "lifelink_notifications",
    label: "Notifications",
    columns: [
      "id",
      "admin_id",
      "subject",
      "body",
      "recipient_mode",
      "created_at",
    ],
    types: {
      id: "uuid",
      admin_id: "uuid",
      subject: "text",
      body: "text",
      recipient_mode: "text",
      created_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["admin_id"],
  },
  {
    table: "lifelink_messages",
    label: "Messages",
    columns: ["id", "sender_id", "body", "reply_to", "created_at", "updated_at"],
    types: {
      id: "uuid",
      sender_id: "uuid",
      body: "text",
      reply_to: "uuid",
      created_at: "timestamptz",
      updated_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["reply_to"],
  },
  {
    table: "lifelink_message_recipients",
    label: "Message Recipients",
    columns: ["message_id", "admin_id"],
    types: { message_id: "uuid", admin_id: "uuid" },
    primaryKey: "message_id",
    conflictTarget: "message_id,admin_id",
    nullable: [],
  },
  {
    table: "lifelink_message_attachments",
    label: "Message Attachments",
    columns: [
      "id",
      "message_id",
      "file_url",
      "file_name",
      "file_type",
      "file_size",
      "created_at",
    ],
    types: {
      id: "uuid",
      message_id: "uuid",
      file_url: "text",
      file_name: "text",
      file_type: "text",
      file_size: "integer",
      created_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["file_type", "file_size"],
  },
  {
    table: "lifelink_notification_recipients",
    label: "Notification Recipients",
    columns: [
      "id",
      "notification_id",
      "user_id",
      "status",
      "sent_at",
      "created_at",
    ],
    types: {
      id: "uuid",
      notification_id: "uuid",
      user_id: "uuid",
      status: "text",
      sent_at: "timestamptz",
      created_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["sent_at"],
  },
  {
    table: "lifelink_audit_logs",
    label: "Audit Logs",
    columns: [
      "id",
      "admin_id",
      "admin_email",
      "action",
      "entity_type",
      "entity_id",
      "details",
      "ip_address",
      "created_at",
    ],
    types: {
      id: "uuid",
      admin_id: "uuid",
      admin_email: "text",
      action: "text",
      entity_type: "text",
      entity_id: "text",
      details: "jsonb",
      ip_address: "text",
      created_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: ["admin_id", "entity_type", "entity_id", "ip_address"],
  },
  {
    table: "registrations",
    label: "Registrations (legacy)",
    columns: [
      "id",
      "service_key",
      "full_name",
      "email",
      "phone",
      "address",
      "occupation",
      "next_of_kin_name",
      "next_of_kin_phone",
      "notes",
      "passport_url",
      "status",
      "source",
      "created_at",
    ],
    types: {
      id: "uuid",
      service_key: "text",
      full_name: "text",
      email: "text",
      phone: "text",
      address: "text",
      occupation: "text",
      next_of_kin_name: "text",
      next_of_kin_phone: "text",
      notes: "text",
      passport_url: "text",
      status: "text",
      source: "text",
      created_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: [],
  },
  {
    table: "contact_messages",
    label: "Contact Messages (legacy)",
    columns: ["id", "full_name", "email", "phone", "message", "source", "created_at"],
    types: {
      id: "uuid",
      full_name: "text",
      email: "text",
      phone: "text",
      message: "text",
      source: "text",
      created_at: "timestamptz",
    },
    primaryKey: "id",
    conflictTarget: "id",
    nullable: [],
  },
];

/**
 * FK-safe import order: parents before children. `lifelink_messages` is
 * imported before its recipients/attachments; the self-referencing `reply_to`
 * column is handled with a two-pass strategy in `backup.ts`.
 */
export const IMPORT_ORDER: string[] = [
  "lifelink_admins",
  "lifelink_users",
  "lifelink_content",
  "lifelink_sectors",
  "lifelink_fundraisers",
  "lifelink_partners",
  "lifelink_events",
  "lifelink_certificates",
  "lifelink_gallery",
  "lifelink_faqs",
  "lifelink_notifications",
  "lifelink_messages",
  "lifelink_message_recipients",
  "lifelink_message_attachments",
  "lifelink_notification_recipients",
  "lifelink_audit_logs",
  "registrations",
  "contact_messages",
];

export const ENTITY_BY_TABLE: Record<string, EntitySchema> = Object.fromEntries(
  BACKUP_ENTITIES.map((e) => [e.table, e]),
);

/**
 * Coerce a raw CSV string into a typed value for Supabase insertion.
 * Throws a descriptive Error on malformed input (caught per-row by the caller).
 */
export function coerceValue(
  raw: string,
  type: ColumnType,
  nullable: boolean,
): unknown {
  const value = (raw ?? "").trim();

  if (value === "") {
    if (nullable) return null;
    // Non-nullable empties fall back to a sensible zero value per type.
    switch (type) {
      case "boolean":
        return false;
      case "integer":
      case "numeric":
        return 0;
      case "jsonb":
        return null;
      default:
        return "";
    }
  }

  switch (type) {
    case "boolean": {
      const lower = value.toLowerCase();
      if (["true", "t", "1", "yes", "y"].includes(lower)) return true;
      if (["false", "f", "0", "no", "n"].includes(lower)) return false;
      throw new Error(`Invalid boolean value "${raw}"`);
    }
    case "integer": {
      const n = Number.parseInt(value, 10);
      if (Number.isNaN(n)) throw new Error(`Invalid integer value "${raw}"`);
      return n;
    }
    case "numeric": {
      const n = Number(value);
      if (Number.isNaN(n)) throw new Error(`Invalid numeric value "${raw}"`);
      return n;
    }
    case "jsonb": {
      try {
        return JSON.parse(value);
      } catch {
        throw new Error(`Invalid JSON value: ${value.slice(0, 60)}...`);
      }
    }
    case "uuid":
    case "text":
    case "timestamptz":
    default:
      return value;
  }
}
