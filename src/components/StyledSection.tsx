import { resolveSectionStyle, type SectionStyle } from "@/lib/sectionStyle";

export function StyledSection({
  style,
  children,
}: {
  style?: SectionStyle | null;
  children: React.ReactNode;
}) {
  const { wrapperClass, wrapperStyle, containerClass, hasOverrides } = resolveSectionStyle(style);
  if (!hasOverrides) return <>{children}</>;
  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {containerClass ? <div className={containerClass}>{children}</div> : children}
    </div>
  );
}
