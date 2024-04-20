"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  title?: string | null;
  items: { value: string; label: string }[];
  onChange: (value: string[]) => void;
}

export function ComboboxMultiSelect({
  items,
  title = "items",
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  const handleSelect = useCallback((id: string) => {
    setSelectedItems((prev) => {
      return [...prev, id];
    });
  }, []);
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLDivElement;
    const id = target.dataset.id;
    if (!id) return;
    setSelectedItems((prev) => {
      const arr = prev.filter((item) => item !== id);
      return arr;
    });
  }, []);

  const validItems = useMemo(() => {
    return items.filter((item) => !selectedItems.includes(item.value));
  }, [selectedItems, items]);
  const contentItems = useMemo(() => {
    return selectedItems.map((id) => {
      const item = items.find((item) => item.value === id);
      if (!item) return null;
      return (
        <Badge key={id} className="!cursor-default">
          {item.label}{" "}
          <X
            size={16}
            className="rounded-full cursor-pointer ml-1"
            data-id={item.value}
            onClick={handleRemove}
          />
        </Badge>
      );
    });
  }, [items, selectedItems]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className="w-full h-fit justify-between"
        >
          {!selectedItems.length && `Select an ${title}...`}
          {!!selectedItems.length && (
            <div className="flex w-full flex-wrap items-center justify-start gap-x-1 gap-y-2">
              {contentItems}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[100vw] min-[400px]:w-60 lg:w-96 p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No {title} found.</CommandEmpty>
          <CommandGroup>
            {validItems.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={handleSelect}
              >
                {/* <Check className={cn("mr-2 h-4 w-4")} /> */}
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
