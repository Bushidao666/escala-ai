import { LoginUI } from '@/components/auth/LoginUI';

interface PageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default async function HomePage(props: PageProps) {
  const searchParams = await props.searchParams;
  return <LoginUI message={searchParams.message} />;
}
