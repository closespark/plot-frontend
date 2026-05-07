/**
 * Integrations catalog + connection state.
 *
 * Disconnected-mode placeholder: the connection list always returns empty
 * until the OAuth flow + token storage exist on the API side. The catalog
 * is static — it's the set of vendors Plot supports, regardless of whether
 * any tenant has connected one.
 *
 * When the API ships, replace `listConnections()` with a real call to
 * `GET /v1/integrations` and wire the OAuth-start endpoints below.
 */

export type IntegrationKind = "crm" | "postcard";

export type IntegrationVendor = {
  id: string;                 // factory key — must match api/crm or api/postcards
  kind: IntegrationKind;
  name: string;               // marketing display name
  blurb: string;              // one-line "what this connects" copy
  oauthStartPath: string;     // future API endpoint kicking off OAuth dance
  docsUrl?: string;           // vendor-side help link, optional
};

export const INTEGRATIONS: IntegrationVendor[] = [
  {
    id: "jobber",
    kind: "crm",
    name: "Jobber",
    blurb: "Field-service ops CRM. Pool & solar SMB ops standard. Leads land as Clients with auto-tagged Plot lead source.",
    oauthStartPath: "/api/integrations/jobber/connect",
    docsUrl: "https://developer.getjobber.com/docs",
  },
  {
    id: "housecall",
    kind: "crm",
    name: "Housecall Pro",
    blurb: "Field-service ops CRM. Leads land in the API Leads channel — purpose-built for vendor-pushed lists.",
    oauthStartPath: "/api/integrations/housecall/connect",
    docsUrl: "https://docs.housecallpro.com/",
  },
  {
    id: "hubspot",
    kind: "crm",
    name: "HubSpot",
    blurb: "Marketing-pipeline CRM. Free tier — widest install base. Leads land as Contacts + Deals in your pipeline.",
    oauthStartPath: "/api/integrations/hubspot/connect",
    docsUrl: "https://developers.hubspot.com/docs/api/overview",
  },
  {
    id: "stannp",
    kind: "postcard",
    name: "Stannp",
    blurb: "Direct-mail postcard rail. We orchestrate the print + mail; you supply the design and pay per piece.",
    oauthStartPath: "/api/integrations/stannp/connect",
    docsUrl: "https://www.stannp.com/us/direct-mail-api/docs",
  },
];

/** A live connection record. The API will return one row per (tenant, vendor)
 * pair where OAuth has completed and a token is stored. */
export type Connection = {
  vendorId: string;            // matches IntegrationVendor.id
  connectedAt: number;         // unix seconds
  accountLabel?: string;       // e.g. "Pacific Pool Services" or "@chris"
};

/**
 * Disconnected-mode stub. Once the API endpoint exists, replace with:
 *
 *     return call("/v1/integrations/connections");
 *
 * Returning a stable empty array keeps the components from null-checking
 * forever — the "no connections yet" branch is the real UI we're building
 * right now.
 */
export async function listConnections(): Promise<Connection[]> {
  return [];
}

export function getVendor(id: string): IntegrationVendor | undefined {
  return INTEGRATIONS.find((v) => v.id === id);
}
