import type { ReactNode } from 'react';
import { Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/joy';
import { Edit, Delete, Warning } from '@mui/icons-material';

export interface BaseCardProps {
  id: string;
  title: string;
  statusChip: {
    label: string;
    color: 'success' | 'danger' | 'warning' | 'primary' | 'neutral';
  };
  icon: ReactNode;
  contentSections: ReactNode[];
  onEdit?: () => void;
  onDelete?: () => void;
  onFaulty?: () => void;
}

export function BaseCard({
  id,
  title,
  statusChip,
  icon,
  contentSections,
  onEdit,
  onDelete,
  onFaulty,
}: BaseCardProps) {
  return (
    <Card
      key={id}
      sx={{
        width: '100%',
        boxShadow: 'sm',
        '&:hover': { boxShadow: 'md' },
        transition: 'box-shadow 0.2s',
      }}
    >
      <Box sx={{ paddingBottom: 0, padding: 1 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 'sm',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'primary.softBg',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography level="title-lg">{title}</Typography>
            <Chip color={statusChip.color} size="sm">
              {statusChip.label}
            </Chip>
          </Box>
          <Box display="flex" gap={1}>
            {onFaulty && (
              <IconButton
                variant="plain"
                color="warning"
                size="sm"
                onClick={onFaulty}
              >
                <Warning fontSize="small" />
              </IconButton>
            )}
            {onEdit && (
              <IconButton
                variant="plain"
                color="primary"
                size="sm"
                onClick={onEdit}
                data-testid={`${id}-edit-button`}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                variant="plain"
                color="danger"
                size="sm"
                onClick={onDelete}
                data-testid={`${id}-delete-button`}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 1,
        }}
      >
        {contentSections.map((section, index) => (
          <Box
            key={index}
            sx={{ marginBottom: index < contentSections.length - 1 ? 2 : 0 }}
          >
            {section}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
