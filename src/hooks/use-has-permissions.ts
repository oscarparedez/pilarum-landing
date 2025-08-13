import { useContext } from 'react';
import { AuthContext } from 'src/contexts/auth';

export const useHasPermission = (permId: number) => {
  const { permissions } = useContext(AuthContext);
  return permissions.includes(permId);
};
