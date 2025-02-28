import Router from 'next/router';

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    // Check if there's a token in localStorage (client-side)
    const token = ctx.req
      ? ctx.req.cookies?.token
      : localStorage.getItem('token');

    // If no token found, redirect to login
    if (!token) {
      if (ctx.res) {
        // Server-side redirect
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
      } else {
        // Client-side redirect
        Router.push('/login');
      }
      return {};
    }

    // Get component's initial props
    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return Wrapper;
};

// Redirect if user is already authenticated
export const redirectIfAuthenticated = (ctx) => {
  const token = ctx.req
    ? ctx.req.cookies?.token
    : localStorage.getItem('token');

  if (token) {
    if (ctx.res) {
      // Server-side redirect
      ctx.res.writeHead(302, { Location: '/dashboard' });
      ctx.res.end();
    } else {
      // Client-side redirect
      Router.push('/dashboard');
    }
    return true;
  }
  
  return false;
};