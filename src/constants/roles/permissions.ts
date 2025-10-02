// permissions.ts
export const PERMISSION_LABEL_TO_ID: Record<string, number> = {
  // 📂 OFICINA — 🏢 Gestión de socios (0–19)
  'Ver socios': 0,
  'Crear socios': 1,
  'Editar socios': 2,
  'Eliminar socios': 3,

  // 📂 OFICINA — 👥 Planilla de personal (20–39)
  'Ver planilla de personal': 20,
  'Crear usuario de planilla': 21,
  'Editar usuario de planilla': 22,
  'Dar de baja usuario de planilla': 23,

  // 📂 OFICINA — 🔐 Roles y permisos (40–59)
  'Ver roles y permisos': 40,
  'Crear nuevo rol': 41,
  'Editar rol y permisos asignados': 42,
  'Eliminar rol': 43,

  // 📂 OFICINA — 💵 Ingresos generales (60–69)
  'Ver ingresos generales': 60,

  // 📂 OFICINA — 💼 Costos generales (70–79)
  'Ver costos generales': 70,

  // 📂 OFICINA — 📦 Inventario (80–139)
  'Ver inventario': 80,
  'Generar orden de compra': 81,
  'Ver historial de órdenes de compra': 82,
  'Ver detalles de orden de compra': 83,
  'Rebajar inventario': 84,
  'Ver historial de rebajas': 85,
  'Ver detalles de una rebaja': 86,
  'Generar traslados de inventario': 87,
  'Ver historial de traslados': 88,
  'Ver materiales': 89,
  'Crear material': 90,
  'Editar material': 91,
  'Ver unidades de medida': 92,
  'Crear unidad de medida': 93,
  'Editar unidad de medida': 94,
  'Ver marcas': 95,
  'Crear marca': 96,
  'Editar marca': 97,
  'Ver proveedores': 98,
  'Crear proveedor': 99,
  'Editar proveedor': 100,
  'Eliminar material': 101,
  'Eliminar unidad de medida': 102,
  'Eliminar marca': 103,
  'Eliminar proveedor': 104,

  // 🏗️ PROYECTOS — 📁 Gestión de proyectos (200–219)
  'Ver proyectos': 200,
  'Crear proyecto': 201,
  'Editar datos básicos del proyecto': 202,
  'Eliminar proyecto': 203,

  // 🏗️ PROYECTOS — 🧾 Presupuesto y fechas (220–239)
  'Ver presupuesto inicial': 220,
  'Ampliar presupuesto inicial': 221,
  'Ver ampliaciones de presupuesto inicial': 222,
  'Editar ampliaciones de presupuesto inicial': 223,
  'Eliminar ampliaciones de presupuesto inicial': 224,
  'Ver fecha estimada de fin de proyecto': 225,
  'Ampliar fecha estimada de fin de proyecto': 226,
  'Ver ampliaciones de fecha de fin de proyecto': 227,
  'Editar ampliación de fecha de fin de proyecto': 228,
  'Eliminar ampliación de fecha de fin de proyecto': 229,

  // 🏗️ PROYECTOS — 📌 Pizarrón de proyecto (240–249)
  'Ver tareas de proyecto': 240,
  'Crear tarea de proyecto': 241,
  'Cambiar status de tarea de proyecto': 242,
  'Eliminar tarea de proyecto': 243,

  // 🏗️ PROYECTOS — 💰 Ingresos y costos del proyecto (250–259)
  'Ver ingresos y costos del proyecto': 250,
  'Registrar ingresos y costos de proyecto': 251,
  'Editar ingresos y costos de proyecto': 252,
  'Eliminar ingresos y costos de proyecto': 253,

  // 🏗️ PROYECTOS — 📋 Asignaciones de maquinaria (260–269)
  'Ver asignaciones de maquinaria a proyecto': 260,
  'Asignar maquinaria a proyecto': 261,
  'Editar asignación de maquinaria a proyecto': 262,
  'Liberar asignación de maquinaria a proyecto': 263,

  // 🏗️ PROYECTOS — 👷 Asignaciones de personal (270–279)
  'Ver asignaciones de personal': 270,
  'Crear asignación de personal': 271,
  'Editar asignación de personal': 272,
  'Liberar asignación de personal': 273,

  // 🏗️ PROYECTOS — 📦 Material asignado (280–289)
  'Ver materiales planificados del proyecto': 280,
  'Ver traslados de materiales del proyecto': 281,
  'Trasladar material de proyecto a bodega central': 282,

  // 🏗️ PROYECTOS — 🖼️ Revisiones de avance (290–299)
  'Ver revisiones del proyecto': 290,
  'Registrar revisión': 291,
  'Editar revisión': 292,
  'Eliminar revisión': 293,

  // 🏗️ PROYECTOS — 💵 Tipos de ingresos (294–296)
  'Ver tipos de ingresos': 294,
  'Crear tipo de ingreso': 295,
  'Editar tipo de ingreso': 296,
  'Eliminar tipo de ingreso': 404,

  // 🏗️ PROYECTOS — 💰 Tipos de costos (297–299)
  'Ver tipos de costos': 297,
  'Crear tipo de costo': 298,
  'Editar tipo de costo': 299,
  'Eliminar tipo de costo': 405,

  // 🚜 MAQUINARIA — 📁 Gestión de maquinaria (300–309)
  'Ver lista de maquinaria': 300,
  'Crear maquinaria': 301,
  'Editar datos básicos de una maquinaria': 302,
  'Eliminar maquinaria': 303,

  // 🚜 MAQUINARIA — 💵 Costos de maquinaria (310–319)
  'Ver costo de adquisición de maquinaria': 310,
  'Ver total gastado en servicios': 311,
  'Ver combustible gastado último mes': 312,

  // 🚜 MAQUINARIA — 📋 Asignaciones (320–329)
  'Ver asignaciones de maquinaria': 320,

  // 🚜 MAQUINARIA — ⚙️ Servicios (330–339)
  'Ver historial de servicios': 330,
  'Registrar servicio': 331,
  'Editar servicio': 332,
  'Eliminar servicio': 333,

  // 🚜 MAQUINARIA — ⛽️ Consumos (340–349)
  'Ver historial de consumos': 340,
  'Registrar consumo': 341,
  'Editar consumo': 342,
  'Eliminar consumo': 343,

  // 📊 GENERAL — 📌 Pizarrón general (400–499)
  'Ver tareas generales': 400,
  'Crear tarea general': 401,
  'Cambiar status de tarea general': 402,
  'Eliminar tarea general': 403,
};

// Útil si quieres autocomplete/constantes:
export const PermissionId = {
  VER_SOCIOS: 0,
  CREAR_SOCIOS: 1,
  EDITAR_SOCIOS: 2,
  ELIMINAR_SOCIOS: 3,
  VER_PLANILLA: 20,
  CREAR_USUARIO_PLANILLA: 21,
  EDITAR_USUARIO_PLANILLA: 22,
  BAJA_USUARIO_PLANILLA: 23,
  VER_ROLES_PERMISOS: 40,
  CREAR_ROL: 41,
  EDITAR_ROL: 42,
  ELIMINAR_ROL: 43,
  VER_INGRESOS_GENERALES: 60,
  VER_COSTOS_GENERALES: 70,
  VER_INVENTARIO: 80,
  GENERAR_ORDEN_COMPRA: 81,
  VER_HIST_OC: 82,
  VER_DETALLE_OC: 83,
  REBAJAR_INVENTARIO: 84,
  VER_HIST_REBAJAS: 85,
  VER_DETALLE_REBAJA: 86,
  GENERAR_TRASLADO: 87,
  VER_HIST_TRASLADOS: 88,
  VER_MATERIALES: 89,
  CREAR_MATERIAL: 90,
  EDITAR_MATERIAL: 91,
  VER_UNIDADES: 92,
  CREAR_UNIDAD: 93,
  EDITAR_UNIDAD: 94,
  VER_MARCAS: 95,
  CREAR_MARCA: 96,
  EDITAR_MARCA: 97,
  VER_PROVEEDORES: 98,
  CREAR_PROVEEDOR: 99,
  EDITAR_PROVEEDOR: 100,
  ELIMINAR_MATERIAL: 101,
  ELIMINAR_UNIDAD: 102,
  ELIMINAR_MARCA: 103,
  ELIMINAR_PROVEEDOR: 104,
  VER_PROYECTOS: 200,
  CREAR_PROYECTO: 201,
  EDITAR_PROYECTO_BASICO: 202,
  ELIMINAR_PROYECTO: 203,
  VER_PRESUPUESTO_INICIAL: 220,
  AMPLIAR_PRESUPUESTO_INICIAL: 221,
  VER_AMPLIACIONES_PRESUPUESTO: 222,
  EDITAR_AMPLIACIONES_PRESUPUESTO: 223,
  ELIMINAR_AMPLIACIONES_PRESUPUESTO: 224,
  VER_FECHA_FIN: 225,
  AMPLIAR_FECHA_FIN: 226,
  VER_AMPLIACIONES_FECHA_FIN: 227,
  EDITAR_AMPLIACION_FECHA_FIN: 228,
  ELIMINAR_AMPLIACION_FECHA_FIN: 229,
  VER_TAREAS_PROYECTO: 240,
  CREAR_TAREA_PROYECTO: 241,
  CAMBIAR_STATUS_TAREA_PROYECTO: 242,
  ELIMINAR_TAREA_PROYECTO: 243,
  VER_INGRESOS_COSTOS_PROYECTO: 250,
  REGISTRAR_INGRESOS_COSTOS_PROYECTO: 251,
  EDITAR_INGRESOS_COSTOS_PROYECTO: 252,
  ELIMINAR_INGRESOS_COSTOS_PROYECTO: 253,
  VER_ASIG_MAQ_PROYECTO: 260,
  ASIGNAR_MAQ_PROYECTO: 261,
  EDITAR_ASIG_MAQ_PROYECTO: 262,
  LIBERAR_ASIG_MAQ_PROYECTO: 263,
  VER_ASIG_PERSONAL: 270,
  CREAR_ASIG_PERSONAL: 271,
  EDITAR_ASIG_PERSONAL: 272,
  LIBERAR_ASIG_PERSONAL: 273,
  VER_MATERIALES_PLANIFICADOS: 280,
  VER_MOV_MATERIALES_PROYECTO: 281,
  TRASLADAR_A_BODEGA_CENTRAL: 282,
  VER_REVISIONES: 290,
  REGISTRAR_REVISION: 291,
  EDITAR_REVISION: 292,
  ELIMINAR_REVISION: 293,
  VER_TIPOS_INGRESO: 294,
  CREAR_TIPO_INGRESO: 295,
  EDITAR_TIPO_INGRESO: 296,
  VER_TIPOS_COSTO: 297,
  CREAR_TIPO_COSTO: 298,
  EDITAR_TIPO_COSTO: 299,
  VER_LISTA_MAQUINARIA: 300,
  CREAR_MAQUINARIA: 301,
  EDITAR_MAQUINARIA_BASICO: 302,
  ELIMINAR_MAQUINARIA: 303,
  VER_COSTO_ADQ_MAQUINARIA: 310,
  VER_TOTAL_SERVICIOS: 311,
  VER_COMBUSTIBLE_ULTIMO_MES: 312,
  VER_ASIGNACIONES_MAQUINARIA: 320,
  VER_HIST_SERVICIOS: 330,
  REGISTRAR_SERVICIO: 331,
  EDITAR_SERVICIO: 332,
  ELIMINAR_SERVICIO: 333,
  VER_HIST_CONSUMOS: 340,
  REGISTRAR_CONSUMO: 341,
  EDITAR_CONSUMO: 342,
  ELIMINAR_CONSUMO: 343,
  VER_TAREAS_GENERALES: 400,
  CREAR_TAREA_GENERAL: 401,
  CAMBIAR_STATUS_TAREA_GENERAL: 402,
  ELIMINAR_TAREA_GENERAL: 403,
  ELIMINAR_TIPO_INGRESO: 404,
  ELIMINAR_TIPO_COSTO: 405,
} as const;

// Helper: de tu estructura seleccionados -> array de IDs
export const mapSeleccionadosToIds = (seleccionados: {
  [subgrupo: string]: string[];
}): number[] => {
  const ids = new Set<number>();
  Object.values(seleccionados).forEach((labels) => {
    labels.forEach((label) => {
      const id = PERMISSION_LABEL_TO_ID[label];
      if (id !== undefined) ids.add(id);
    });
  });
  return Array.from(ids).sort((a, b) => a - b);
};

export const permisosAgrupados: Record<string, Record<string, string[]>> = {
  '📂 OFICINA': {
    '🏢 Gestión de socios': ['Ver socios', 'Crear socios', 'Editar socios', 'Eliminar socios'],
    '👥 Planilla de personal': [
      'Ver planilla de personal',
      'Crear usuario de planilla',
      'Editar usuario de planilla',
      'Dar de baja usuario de planilla',
    ],
    '🔐 Roles y permisos': [
      'Ver roles y permisos',
      'Crear nuevo rol',
      'Editar rol y permisos asignados',
      'Eliminar rol',
    ],
    '💵 Ingresos generales': ['Ver ingresos generales'],
    '💼 Costos generales': ['Ver costos generales'],
    '📦 Inventario': [
      'Ver inventario',
      'Generar orden de compra',
      'Ver historial de órdenes de compra',
      'Ver detalles de orden de compra',
      'Rebajar inventario',
      'Ver historial de rebajas',
      'Ver detalles de una rebaja',
      'Generar traslados de inventario',
      'Ver historial de traslados',
      'Ver materiales',
      'Crear material',
      'Editar material',
      'Eliminar material',
      'Ver unidades de medida',
      'Crear unidad de medida',
      'Editar unidad de medida',
      'Eliminar unidad de medida',
      'Ver marcas',
      'Crear marca',
      'Editar marca',
      'Eliminar marca',
      'Ver proveedores',
      'Crear proveedor',
      'Editar proveedor',
      'Eliminar proveedor',
    ],
  },
  '🏗️ PROYECTOS': {
    '📁 Gestión de proyectos': [
      'Ver proyectos',
      'Crear proyecto',
      'Editar datos básicos del proyecto',
      'Eliminar proyecto',
    ],
    '🧾 Presupuesto y fechas': [
      'Ver presupuesto inicial',
      'Ampliar presupuesto inicial',
      'Ver ampliaciones de presupuesto inicial',
      'Editar ampliaciones de presupuesto inicial',
      'Eliminar ampliaciones de presupuesto inicial',
      'Ver fecha estimada de fin de proyecto',
      'Ampliar fecha estimada de fin de proyecto',
      'Ver ampliaciones de fecha de fin de proyecto',
      'Editar ampliación de fecha de fin de proyecto',
      'Eliminar ampliación de fecha de fin de proyecto',
    ],
    '📌 Pizarrón de proyecto': [
      'Ver tareas de proyecto',
      'Crear tarea de proyecto',
      'Cambiar status de tarea de proyecto',
      'Eliminar tarea de proyecto',
    ],
    '💰 Ingresos y costos del proyecto': [
      'Ver ingresos y costos del proyecto',
      'Registrar ingresos y costos de proyecto',
      'Editar ingresos y costos de proyecto',
      'Eliminar ingresos y costos de proyecto',
    ],
    '📋 Asignaciones de maquinaria a proyecto': [
      'Ver asignaciones de maquinaria a proyecto',
      'Asignar maquinaria a proyecto',
      'Editar asignación de maquinaria a proyecto',
      'Liberar asignación de maquinaria a proyecto',
    ],
    '👷 Asignaciones de personal': [
      'Ver asignaciones de personal',
      'Crear asignación de personal',
      'Editar asignación de personal',
      'Liberar asignación de personal',
    ],
    '📦 Material asignado a proyecto': [
      'Ver materiales planificados del proyecto',
      'Ver traslados de materiales del proyecto',
      'Trasladar material de proyecto a bodega central',
    ],
    '🖼️ Revisiones de avance': [
      'Ver revisiones del proyecto',
      'Registrar revisión',
      'Editar revisión',
      'Eliminar revisión',
    ],
    '💵 Tipos de ingresos': [
      'Ver tipos de ingresos',
      'Crear tipo de ingreso',
      'Editar tipo de ingreso',
      'Eliminar tipo de ingreso',
    ],
    '💰 Tipos de costos': [
      'Ver tipos de costos',
      'Crear tipo de costo',
      'Editar tipo de costo',
      'Eliminar tipo de costo',
    ],
  },
  '🚜 MAQUINARIA': {
    '📁 Gestión de maquinaria': [
      'Ver lista de maquinaria',
      'Crear maquinaria',
      'Editar datos básicos de una maquinaria',
      'Eliminar maquinaria',
    ],
    '💵 Costos de maquinaria': [
      'Ver costo de adquisición de maquinaria',
      'Ver total gastado en servicios',
      'Ver combustible gastado último mes',
    ],
    '📋 Asignaciones de maquinaria ': ['Ver asignaciones de maquinaria'],
    '⚙️ Servicios de maquinaria': [
      'Ver historial de servicios',
      'Registrar servicio',
      'Editar servicio',
      'Eliminar servicio',
    ],
    '⛽️ Consumos de maquinaria': [
      'Ver historial de consumos',
      'Registrar consumo',
      'Editar consumo',
      'Eliminar consumo',
    ],
  },
  '📊 GENERAL': {
    '📌 Pizarrón general': [
      'Ver tareas generales',
      'Crear tarea general',
      'Cambiar status de tarea general',
      'Eliminar tarea general',
    ],
  },
};
