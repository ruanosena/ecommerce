/* eslint-disable @next/next/no-img-element */
import { ImgHTMLAttributes } from "react";
import { media as wixMedia } from "@wix/sdk";

type WixImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height" | "alt"
> & {
  mediaIdentifier?: string;
  placeholder?: string;
  alt?: string | null;
} & (
    | {
        scaleToFill?: true;
        width: number;
        height: number;
      }
    | {
        scaleToFill: false;
      }
  );

export default function WixImage({
  mediaIdentifier,
  placeholder = "/placeholder.png",
  alt,
  ...props
}: WixImageProps) {
  const imageUrl = mediaIdentifier
    ? props.scaleToFill || props.scaleToFill === undefined
      ? wixMedia.getScaledToFillImageUrl(
          mediaIdentifier,
          props.width,
          props.height,
          {},
        )
      : wixMedia.getImageUrl(mediaIdentifier).url
    : placeholder;

  return <img src={imageUrl} alt={alt || ""} {...props} />;
}
