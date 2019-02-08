import React, { SFC, useState, Suspense } from 'react';
import { RouteComponentProps, Redirect } from '@reach/router';
import useAuth from '@/hooks/useAuth';
import { Box, Button, Layer } from 'grommet';
import CreateCardForm from '@/components/forms/CreateCardForm';

interface SessionPageProps extends RouteComponentProps {
  sessionId?: string;
}

const SessionPage: SFC<SessionPageProps> = ({ sessionId }) => {
  const { isLoggedIn, token } = useAuth();
  const [showCreateCardModal, setShowCreateCardModal] = useState(false);
  const hideCreateCardModal = () => setShowCreateCardModal(false);

  if (!isLoggedIn || token.sessionId !== sessionId) {
    return <Redirect to={`/sessions/${sessionId}/join`} />;
  }

  return (
    <>
      <Box fill>
        <Button onClick={() => setShowCreateCardModal(true)} label="Add Card" />
      </Box>
      {showCreateCardModal && (
        <Layer
          position="center"
          onClickOutside={hideCreateCardModal}
          onEsc={hideCreateCardModal}
        >
          <Box pad="medium">
            <Suspense fallback={<div>Loading...</div>}>
              <CreateCardForm
                onCancel={hideCreateCardModal}
                onCreate={hideCreateCardModal}
              />
            </Suspense>
          </Box>
        </Layer>
      )}
    </>
  );
};

export default SessionPage;
