import { Chip } from '@mui/joy';
import type { Characteristic } from '@/api/generated';

export interface CharacteristicChipProps {
  characteristic: Characteristic;
}

function formatType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function CharacteristicChip({
  characteristic: char,
}: CharacteristicChipProps) {
  const label = formatType(char.type);
  if (typeof char.value === 'boolean') {
    if (char.value) {
      return (
        <Chip key={`${char.type}`} size="sm" variant="soft">
          {label}
        </Chip>
      );
    }
    return null;
  } else if (typeof char.value === 'number') {
    return (
      <Chip key={`${char.type}`} size="sm" variant="soft">
        {label}: {char.value}
      </Chip>
    );
  } else if (typeof char.value === 'string') {
    return (
      <Chip key={`${char.type}`} size="sm" variant="soft">
        {label}: {char.value}
      </Chip>
    );
  }
}
