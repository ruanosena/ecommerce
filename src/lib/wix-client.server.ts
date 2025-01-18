import { ApiKeyStrategy, createClient, Tokens } from "@wix/sdk";
import { getWixClient } from "./wix-client.base";
import { cookies } from "next/headers";
import { WIX_SESSION_COOKIE } from "./constants";
import { cache } from "react";
import { files } from "@wix/media";
import { env } from "@/env";

export const getWixServerClient = cache(async () => {
  let tokens: Tokens | undefined;

  try {
    tokens = JSON.parse(
      (await cookies()).get(WIX_SESSION_COOKIE)?.value ?? "{}",
    );
  } catch {}

  return getWixClient(tokens);
});

export const getWixAdminClient = cache(() => {
  const wixClient = createClient({
    modules: {
      files,
    },
    auth: ApiKeyStrategy({
      apiKey: env.WIX_API_KEY,
      siteId: env.NEXT_PUBLIC_WIX_SITE_ID,
    }),
  });

  return wixClient;
});
