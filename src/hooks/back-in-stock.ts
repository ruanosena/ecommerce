import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  BackInStockNotificationRequestValues,
  createBackInStockNotificationRequest,
} from "@/wix-api/backInStockNotifications";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useCreateBackInStockNotificationRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: BackInStockNotificationRequestValues) =>
      createBackInStockNotificationRequest(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).details.applicationError.code ===
        "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        toast({
          variant: "destructive",
          description: "Você já está inscrito para este produto.",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Algo deu errado, tente novamente.",
        });
      }
    },
  });
}
