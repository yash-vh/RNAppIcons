import type { IconVariant } from "../shapes/types";
import { getShapeDefinition } from "../shapes/registry";

interface Props {
  variant: IconVariant;
  imageSrc: string | null;
  size?: number;
}

/** Live SVG preview of a variant — cheap enough to re-render on every slider tick. */
export default function ShapePreview({ variant, imageSrc, size = 96 }: Props) {
  const def = getShapeDefinition(variant.shape);
  const path = def.getPath(variant);
  const clipId = `clip-${variant.id}`;

  const scalePct = variant.scale * 100;
  const imgX = 50 - scalePct / 2 + variant.x * 25;
  const imgY = 50 - scalePct / 2 + variant.y * 25;

  const bgFill =
    variant.background.type === "solid"
      ? variant.background.color
      : variant.background.type === "gradient"
      ? `url(#grad-${variant.id})`
      : "none";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={variant.name}>
      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
        {variant.background.type === "gradient" && (
          <linearGradient id={`grad-${variant.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={variant.background.gradientFrom ?? "#fff"} />
            <stop offset="100%" stopColor={variant.background.gradientTo ?? "#000"} />
          </linearGradient>
        )}
      </defs>
      {variant.shadow?.enabled && (
        <path d={path} fill="#000" opacity={0.25} transform={`translate(0 ${variant.shadow.offsetY / 10})`} />
      )}
      <g clipPath={`url(#${clipId})`}>
        {bgFill !== "none" && <rect x={0} y={0} width={100} height={100} fill={bgFill} />}
        {imageSrc && (
          <image href={imageSrc} x={imgX} y={imgY} width={scalePct} height={scalePct} preserveAspectRatio="xMidYMid meet" />
        )}
      </g>
      {variant.border?.enabled && (
        <path d={path} fill="none" stroke={variant.border.color} strokeWidth={variant.border.width / 10} />
      )}
    </svg>
  );
}
