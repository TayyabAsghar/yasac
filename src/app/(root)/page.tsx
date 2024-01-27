import { currentUser } from '@clerk/nextjs';

const LandingPage = async () => {
  const user = await currentUser();
  // if (!user) return null;

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>
    </>
  );
};

export default LandingPage;
