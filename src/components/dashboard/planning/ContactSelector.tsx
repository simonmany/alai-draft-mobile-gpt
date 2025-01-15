import { Check, ChevronsUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { contacts } from "./constants";

interface ContactSelectorProps {
  person: string;
  setPerson: (person: string) => void;
  personOpen: boolean;
  setPersonOpen: (open: boolean) => void;
}

const ContactSelector = ({
  person,
  setPerson,
  personOpen,
  setPersonOpen,
}: ContactSelectorProps) => {
  // Ensure contacts is defined and has a default empty array if undefined
  const contactsList = contacts || [];

  return (
    <Popover open={personOpen} onOpenChange={setPersonOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={personOpen}
          className="w-full justify-between"
        >
          {person ? person : "Select person..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search people..." />
          <CommandEmpty>No person found.</CommandEmpty>
          <CommandGroup>
            {contactsList.map((contact) => (
              <CommandItem
                key={contact.id}
                value={contact.name}
                onSelect={(currentValue) => {
                  setPerson(currentValue === person ? "" : currentValue);
                  setPersonOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    person === contact.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {contact.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ContactSelector;