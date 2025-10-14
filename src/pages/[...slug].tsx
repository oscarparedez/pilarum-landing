import { useRouter } from 'src/hooks/use-router';
import { useEffect } from 'react';

// This catch-all route will redirect any unmatched paths to the landing page
const CatchAllPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
};

export default CatchAllPage;