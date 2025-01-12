import { env } from "@/env";
import { WixClient } from "@/lib/wix-client.base";
import { checkout } from "@wix/ecom";

export async function getCheckoutUrlForCurrentCart(wixClient: WixClient) {
  const { checkoutId } =
    await wixClient.currentCart.createCheckoutFromCurrentCart({
      channelType: checkout.ChannelType.WEB,
    });

  const { redirectSession } = await wixClient.redirects.createRedirectSession({
    ecomCheckout: { checkoutId },
    callbacks: {
      postFlowUrl: window.location.href,
      thankYouPageUrl: env.NEXT_PUBLIC_BASE_URL + "/sucesso-finalizacao",
    },
  });

  if (!redirectSession) {
    throw Error("Falha ao criar sessão de redirecionamento");
  }

  return redirectSession.fullUrl;
}
