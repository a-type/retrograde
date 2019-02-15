import React, { SFC, useState, Suspense } from 'react';
import { RouteComponentProps, Redirect } from '@reach/router';
import useAuth from '@/hooks/useAuth';
import { Box, DropButton, Button } from 'grommet';
import CreateCardForm from '@/components/forms/CreateCardForm';
import Board from '@/components/board/Board';
import SortChanger from '@/components/board/SortChanger';

interface SessionPageProps extends RouteComponentProps {
  sessionId?: string;
}

const SessionPage: SFC<SessionPageProps> = ({ sessionId }) => {
  const { isLoggedIn, token } = useAuth();
  const [createCardModalIsVisible, setCreateCardModalIsVisible] = useState(
    false,
  );
  const showCreateCardModal = () => setCreateCardModalIsVisible(true);
  const hideCreateCardModal = () => setCreateCardModalIsVisible(false);

  if (!isLoggedIn || token.sessionId !== sessionId) {
    return <Redirect to={`/sessions/${sessionId}/join`} />;
  }

  return (
    <Box fill align="start" justify="start">
      <Box
        direction="row"
        background="dark-1"
        pad={{ horizontal: 'large', vertical: 'small' }}
        width="100%"
        style={{ justifyContent: 'space-between' }}
      >
        <Suspense fallback={<Button disabled label="Add Card" />}>
          <DropButton
            open={createCardModalIsVisible}
            onOpen={showCreateCardModal}
            onClose={hideCreateCardModal}
            dropAlign={{
              top: 'top',
              left: 'left',
            }}
            dropContent={
              <Box pad="medium">
                <CreateCardForm
                  onCancel={hideCreateCardModal}
                  onCreate={hideCreateCardModal}
                />
              </Box>
            }
            {...{ label: 'Add Card' } as any}
          />
        </Suspense>

        <SortChanger />
      </Box>
      <Board />
    </Box>
  );
};

export default SessionPage;
