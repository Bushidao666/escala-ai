import { LoginUI } from '@/components/auth/LoginUI';

interface HomePageProps {
  searchParams: {
    message?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  return <LoginUI message={searchParams.message} />;
}
