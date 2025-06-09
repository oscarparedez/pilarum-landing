import type { FC } from 'react';
import { useState } from 'react';
import {
  Modal,
  Backdrop,
  Box,
  IconButton,
  Typography,
  Stack,
} from '@mui/material';
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
          height: '70vh',
          p: 2,
          boxShadow: 24,
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Fotos del consumo</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          position="relative"
          flexGrow={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ overflow: 'hidden' }}
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
              width: '100%',
              maxHeight: 800,
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

        <Typography variant="caption" color="text.secondary" align="center" mt={1}>
          {index + 1} / {images.length}
        </Typography>
      </Box>
    </Modal>
  );
};
