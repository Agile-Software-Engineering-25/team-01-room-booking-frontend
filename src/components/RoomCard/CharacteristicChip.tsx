import { Chip } from '@mui/joy';
import type { Characteristic } from '@/api/generated';

export interface CharacteristicChipProps {
  characteristic: Characteristic;
}

export function CharacteristicChip({
  characteristic: char,
}: CharacteristicChipProps) {
  if (typeof char.value === 'boolean') {
    if (char.value) {
      return (
        <Chip key={`${char.type}`} size="sm" variant="soft">
          {char.type}
        </Chip>
      );
    }
    return null;
  } else if (typeof char.value === 'number') {
    return (
      <Chip key={`${char.type}`} size="sm" variant="soft">
        {char.type}: {char.value}
      </Chip>
    );
  } else if (typeof char.value === 'string') {
    return (
      <Chip key={`${char.type}`} size="sm" variant="soft">
        {char.type}: {char.value}
      </Chip>
    );
  }
}
