import React from 'react';
import Link from 'next/link';
import { Button, Segment, Header } from 'semantic-ui-react';
import { handleLogout } from '../../utils/auth';

const AccountHeader = ({ user }) => {
  const addPermissions =
    user && (user.role === 'admin' || user.role === 'root');
  return (
    <Segment color='grey' inverted style={{ marginTop: '1em' }}>
      <Header as='h2'>{user.email}</Header>
      {addPermissions && (
        <Link href='/add'>
          <Button color='twitter'>Add product</Button>
        </Link>
      )}
      <Link href='/add'>
        <Button color='red' onClick={handleLogout}>
          Log out
        </Button>
      </Link>
    </Segment>
  );
};

export default AccountHeader;
