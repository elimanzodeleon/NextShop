import React from 'react';
import AccountHeader from '../components/Account/AccountHeader';
import { Button } from 'semantic-ui-react';
import { handleLogout } from '../utils/auth';

const Account = ({ user }) => {
  const addPermissions =
    user && (user.role === 'admin' || user.role === 'root');
  return (
    <>
      {addPermissions && <AccountHeader />}
      <Button color='red' onClick={handleLogout}>
        Log out
      </Button>
    </>
  );
};

export default Account;
