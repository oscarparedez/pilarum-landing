import { useContext } from 'react';

import type { AuthContextType as JwtAuthContextType } from 'src/contexts/auth';
import { AuthContext } from 'src/contexts/auth';

export const useAuth = <T = JwtAuthContextType>() => useContext(AuthContext) as T;
