import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
          <SelectItem value="10">10 / page</SelectItem>
          <SelectItem value="20">20 / page</SelectItem>
          <SelectItem value="30">30 / page</SelectItem>
          <SelectItem value="40">40 / page</SelectItem>
          <SelectItem value="50">50 / page</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}