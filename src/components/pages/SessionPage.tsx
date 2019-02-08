import * as React from 'react';
import { RouteComponentProps, Redirect } from '@reach/router';
import useAuth from '@/hooks/useAuth';

interface SessionPageProps extends RouteComponentProps {
  sessionId?: string;
}

const SessionPage: React.SFC<SessionPageProps> = ({ sessionId }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect to={`/sessions/${sessionId}/join`} />;
  }

  return <div>Session ${sessionId}</div>;
};

export default SessionPage;
