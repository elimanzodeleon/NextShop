import React from 'react';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';

const AccountHeader = () => {
  return (
    <div>
      <Link href='/add'>
        <Button color='twitter'>Add product</Button>
      </Link>
    </div>
  );
};

export default AccountHeader;
