export interface ModalCrearTipoIngresoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Omit<TipoIngreso, 'id'>) => void;
}

export interface ModalEditarTipoIngresoProps {
  open: boolean;
  onClose: () => void;
  initialData: TipoIngreso;
  onConfirm: (data: TipoIngreso) => void;
}
