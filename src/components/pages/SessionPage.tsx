import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

interface SessionPageProps extends RouteComponentProps {
  sessionId?: string;
}

const SessionPage: React.SFC<SessionPageProps> = ({ sessionId }) => {
  return <div>Session ${sessionId}</div>;
};

export default SessionPage;
