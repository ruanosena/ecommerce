import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import {
  createProductReview,
  CreateProductReviewValues,
} from "@/wix-api/reviews";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useCreateProductReview() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: CreateProductReviewValues) =>
      createProductReview(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Falha ao criar avaliação. Tente novamente",
      });
    },
  });
}