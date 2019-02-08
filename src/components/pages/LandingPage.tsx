import React, { SFC, useState } from 'react';
import { Layer, Box, Heading, Button } from 'grommet';
import CreateSessionForm from '@/components/forms/CreateSessionForm';
import { RouteComponentProps, navigate } from '@reach/router';

const LandingPage: SFC<RouteComponentProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);

  return (
    <>
      <Box align="center" justify="end" fill pad="large">
        <Box width="900px" align="start">
          <Heading>Retrograde</Heading>
          <Button
            primary
            label="Start a Session"
            onClick={() => setShowModal(true)}
          />
        </Box>
      </Box>
      {showModal && (
        <Layer position="bottom" onClickOutside={hideModal} margin="large">
          <Box pad="large">
            <CreateSessionForm
              onCancel={hideModal}
              onCreate={id => navigate(`/sessions/${id}`)}
            />
          </Box>
        </Layer>
      )}
    </>
  );
};

export default LandingPage;
