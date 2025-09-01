import { es } from 'date-fns/locale';

// Create a custom Spanish locale with capitalized months
const esCapitalized = {
  ...es,
  localize: {
    ...es.localize,
    month: (n: number, options: any = {}) => {
      const month = es.localize?.month(n, options);
      return month ? month.charAt(0).toUpperCase() + month.slice(1) : '';
    },
  },
};

export { esCapitalized };
