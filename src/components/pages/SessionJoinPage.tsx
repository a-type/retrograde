import React, { SFC } from 'react';
import { Box } from 'grommet';
import CreateUserForm from '@/components/forms/CreateUserForm';
import { RouteComponentProps, navigate } from '@reach/router';

const SessionJoinPage: SFC<RouteComponentProps & { sessionId?: string }> = ({
  sessionId,
}) => {
  return (
    <Box fill align="center" justify="center" pad="large">
      <Box pad="medium">
        <CreateUserForm
          sessionId={sessionId}
          onCreate={() => navigate(`/sessions/${sessionId}`)}
          onCancel={() => navigate('/')}
        />
      </Box>
    </Box>
  );
};

export default SessionJoinPage;
