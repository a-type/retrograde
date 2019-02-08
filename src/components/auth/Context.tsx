import React, { createContext, SFC, useState, useEffect } from 'react';
import auth from '@/apollo/auth';

type AuthContext = {
  isLoggedIn: boolean;
  token: {
    name: string;
    sessionId: string;
    userId: string;
  };
};

const Context = createContext<AuthContext>({ isLoggedIn: false, token: null });
const { Provider: BaseProvider, Consumer } = Context;

const Provider: SFC<{}> = props => {
  const [decoded, setDecoded] = useState(auth.decodedToken);
  useEffect(() => {
    auth.on('CHANGED', setDecoded);
    return () => auth.off('CHANGED', setDecoded);
  }, []);

  return (
    <BaseProvider
      value={{
        isLoggedIn: !!decoded,
        token: decoded,
      }}
      {...props}
    />
  );
};

export default Context;

export { Consumer, Provider };
