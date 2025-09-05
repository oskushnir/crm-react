import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { selectItems } from "@/utils/selectItems";

type Props = {
  limit: string;
  updateLimit: (limit: string) => void;
}

export function Selector({ limit, updateLimit }: Props) {
  return (
    <Select value={limit} onValueChange={(value) => updateLimit(value)}>
      <SelectTrigger className="w-[180px] cursor-pointer">
        <SelectValue placeholder="Per page" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Per page</SelectLabel>
          {selectItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}