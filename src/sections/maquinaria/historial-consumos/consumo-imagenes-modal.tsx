import type { FC } from 'react';
import { useState } from 'react';
import { Modal, Backdrop, Box, IconButton, Typography, Stack, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Props {
  open: boolean;
  onClose: () => void;
  images: string[];
}

export const ConsumoImagenesModal: FC<Props> = ({ open, onClose, images }) => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setIndex(0);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          width: '75vw',
          height: '75vh',
          boxShadow: 24,
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Section */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0,
                }}
              >
                Fotos del Consumo
              </Typography>
            </Box>

            <IconButton
              onClick={onClose}
              sx={{
                ml: 2,
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Image Gallery Section */}
        <Box
          position="relative"
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{ position: 'absolute', left: 0, zIndex: 2 }}
            disabled={images.length <= 1}
          >
            <ChevronLeftIcon />
          </IconButton>

          <Box
            component="img"
            src={images[index]}
            alt={`Foto ${index + 1}`}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />

          <IconButton
            onClick={handleNext}
            sx={{ position: 'absolute', right: 0, zIndex: 2 }}
            disabled={images.length <= 1}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Footer with image counter */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Chip
            label={`${index + 1} de ${images.length}`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>
    </Modal>
  );
};
