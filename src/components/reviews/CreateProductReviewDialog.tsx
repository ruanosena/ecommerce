import { products } from "@wix/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductReview } from "@/hooks/reviews";
import { Label } from "../ui/label";
import WixImage from "../WixImage";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../LoadingButton";
import StarRatingInput from "./StarRatingInput";
import { useRef } from "react";
import { CircleAlert, ImageUp, Loader2, X } from "lucide-react";
import BigIconButton from "@/app/NavbarButton";
import useMediaUpload, { MediaAttachment } from "./useMediaUpload";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Deve ter pelo menos 5 caracteres")
    .max(100, "Não pode ter mais de 100 caracteres")
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, "Deve ter pelo menos 10 caracteres")
    .max(3000, "Não pode ter mais de 3000 caracteres")
    .or(z.literal("")),
  rating: z.number().int().min(1, "Por favor, avalie este produto"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProductReviewDialogProps {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

export default function CreateProductReviewDialog({
  product,
  open,
  onOpenChange,
  onSubmitted,
}: CreateProductReviewDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      rating: 0,
    },
  });

  const mutation = useCreateProductReview();

  const { attachments, startUpload, removeAttachment, clearAttachments } =
    useMediaUpload();

  const router = useRouter();

  async function onSubmit({ title, body, rating }: FormValues) {
    if (!product._id) {
      throw Error("Está faltando o ID do produto");
    }

    mutation.mutate(
      {
        productId: product._id,
        title,
        body,
        rating,
        media: attachments
          .filter((m) => m.url)
          .map((m) => ({
            url: m.url!,
            type: m.file.type.startsWith("image") ? "image" : "video",
          })),
      },
      {
        onSuccess: () => {
          form.reset();
          clearAttachments();
          onSubmitted();
          setTimeout(() => {
            router.refresh();
          }, 2000);
        },
      },
    );
  }

  const uploadInProgress = attachments.some((m) => m.state === "uploading");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-screen flex-col">
        <DialogHeader>
          <DialogTitle>Escreva uma avaliação</DialogTitle>
          <DialogDescription>
            Você gostou deste produto? Compartilhe suas ideias com outros
            clientes.
          </DialogDescription>
        </DialogHeader>
        <div className="grow space-y-5 overflow-y-auto">
          <div className="space-y-2">
            <Label>Produto</Label>
            <div className="flex items-center gap-3">
              <WixImage
                mediaIdentifier={product.media?.mainMedia?.image?.url}
                width={50}
                height={50}
              />
              <span className="font-bold">{product.name}</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classificação</FormLabel>
                    <FormControl>
                      <StarRatingInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Conte aos outros sobre sua experiência..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Escreva uma avaliação detalhada para ajudar outros
                      clientes.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <div className="flex flex-wrap gap-5">
                  {attachments.map((attachment) => (
                    <AttachmentPreview
                      key={attachment.id}
                      attachment={attachment}
                      onRemoveClick={removeAttachment}
                    />
                  ))}
                  <AddMediaButton
                    onFileSelected={startUpload}
                    disabled={
                      attachments.filter((a) => a.state !== "failed").length >=
                      5
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Envie imagens ou gravação do produto.
                </p>
              </div>
              <LoadingButton
                type="submit"
                loading={mutation.isPending}
                className="w-full"
                disabled={uploadInProgress}
              >
                Enviar
              </LoadingButton>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AddMediaButtonProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}

function AddMediaButton({ onFileSelected, disabled }: AddMediaButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <BigIconButton
        variant="outline"
        title="Add mídia"
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageUp />
      </BigIconButton>
      <input
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) {
            onFileSelected(files[0]);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}

function AttachmentPreview({
  attachment: { id, file, state, url },
  onRemoveClick,
}: AttachmentPreviewProps) {
  return (
    <div
      className={cn("relative size-fit", {
        ["outline outline-1 outline-destructive"]: state === "failed",
      })}
    >
      {file.type.startsWith("image") ? (
        <WixImage
          mediaIdentifier={url}
          scaleToFill={false}
          placeholder={URL.createObjectURL(file)}
          alt="Prévia do anexo"
          className={cn("max-h-24 max-w-24 object-contain", {
            ["opacity-50"]: !url,
          })}
        />
      ) : (
        <video
          controls
          className={cn("max-h-24 max-w-24", {
            ["opacity-50"]: !url,
          })}
        >
          <source src={url ?? URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {state === "uploading" && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {state === "failed" && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          title="Falha ao enviar mídia"
        >
          <CircleAlert className="text-destructive" />
        </div>
      )}
      <button
        title="Remover mídia"
        type="button"
        onClick={() => onRemoveClick(id)}
        className="absolute -right-1.5 -top-1.5 border bg-background"
      >
        <X size={24} />
      </button>
    </div>
  );
}
