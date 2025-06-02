import { useEffect } from 'react';
import { useRouter } from 'src/hooks/use-router';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';

const IndexPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(paths.dashboard.index); // or whatever your app home is
    } else {
      router.replace(paths.auth.login);
    }
  }, [isAuthenticated, router]);

  return null;
};

export default IndexPage;
