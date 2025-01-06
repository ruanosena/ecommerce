import { wixBrowserClient } from "@/lib/wix-client.browser";
import {
  addToCart,
  AddToCartValues,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  UpdateCartItemQuantityValues,
} from "@/wix-api/cart";
import {
  MutationKey,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { useToast } from "./use-toast";

const queryKey: QueryKey = ["cart"];

export function useCart(initialData: currentCart.Cart | null) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getCart(wixBrowserClient),
    initialData,
  });
}

export function useAddItemToCart() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: AddToCartValues) =>
      addToCart(wixBrowserClient, values),
    onSuccess(data) {
      toast({ description: "Item adicionado à sacola" });
      queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, data.cart);
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          "Não foi possível adicionar o item à sacola, tente novamente.",
      });
    },
  });
}

export function useUpdateItemQuantity() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutationKey: MutationKey = ["useUpdateItemQuantity"];

  return useMutation({
    mutationKey,
    mutationFn: (values: UpdateCartItemQuantityValues) =>
      updateCartItemQuantity(wixBrowserClient, values),
    onMutate: async ({ productId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);

      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.map((lineItem) =>
          lineItem._id === productId
            ? { ...lineItem, quantity: newQuantity }
            : lineItem,
        ),
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Algo deu errado, tente novamente",
      });
    },
    onSettled() {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId: string) =>
      removeCartItem(wixBrowserClient, productId),
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState =
        queryClient.getQueryData<currentCart.Cart>(queryKey);

      queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
        ...oldData,
        lineItems: oldData?.lineItems?.filter(
          (lineItem) => lineItem._id !== productId,
        ),
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Algo deu errado, tente novamente",
      });
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
