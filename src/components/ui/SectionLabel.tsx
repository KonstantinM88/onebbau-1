interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-primary-500 mb-3">
      <span className="w-8 h-[2px] bg-primary-500 rounded-full" />
      {text}
    </span>
  );
}
