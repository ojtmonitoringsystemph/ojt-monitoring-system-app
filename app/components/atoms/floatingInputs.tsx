import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export const FloatingInput = ({ label, name, value, onChange, disabled }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean }) => (
    <div className="relative ">
      <Label className="absolute top-1 left-3 text-xs text-gray-500">{label}</Label>
      <Input className="pt-7 pb-3 px-3 bg-gray-50 rounded-none" name={name} value={value} onChange={onChange} disabled={disabled} />
    </div>
);