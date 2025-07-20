export interface TipoPago {
  id: number;
  nombre: string;
}

export interface ModalCrearTipoPagoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Omit<TipoPago, 'id'>) => void;
}

export interface ModalEditarTipoPagoProps {
  open: boolean;
  onClose: () => void;
  initialData: TipoPago;
  onConfirm: (data: TipoPago) => void;
}
