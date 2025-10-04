export default function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
      <span className="text-[15px] leading-6">{children}</span>
    </li>
  );
}
