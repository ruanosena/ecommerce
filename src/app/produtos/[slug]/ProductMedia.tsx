import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";

interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}
export default function ProductMedia({ media }: ProductMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);

  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <div className="h-fit basis-2/5 space-y-5 md:sticky md:top-0">
      <div className="aspect-square bg-secondary">
        {selectedImage?.url ? (
          <Zoom key={selectedImage.url}>
            <WixImage
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText}
              width={1000}
              height={1000}
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black">
            <video controls className="size-full object-cover">
              <source
                src={selectedVideo.url}
                type={`video/${selectedVideo.format}`}
              />
            </video>
          </div>
        ) : null}
      </div>

      {media.length > 1 && (
        <div className="flex flex-wrap gap-5">
          {media.map((item) => (
            <MediaPreview
              key={item._id}
              item={item}
              isSelected={item._id === selectedMedia?._id}
              onSelect={() => setSelectedMedia(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
interface MediaPreviewProps {
  item: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}
function MediaPreview({ item, isSelected, onSelect }: MediaPreviewProps) {
  const imageUrl = item.image?.url;
  const stillFrameMediaId = item.video?.stillFrameMediaId;
  const thumbnailUrl = item.thumbnail?.url;
  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbnailUrl
      ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div
      className={cn("relative cursor-pointer bg-secondary", {
        ["outline outline-1 outline-primary"]: isSelected,
      })}
    >
      <WixImage
        mediaIdentifier={imageUrl ?? resolvedThumbnailUrl}
        alt={item.image?.altText || item.video?.files?.[0].altText}
        width={100}
        height={100}
        onMouseEnter={onSelect}
      />
      {resolvedThumbnailUrl && (
        <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40">
          <Play className="size-6 text-white/60" />
        </span>
      )}
    </div>
  );
}
