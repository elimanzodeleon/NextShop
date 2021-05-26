import React from 'react';
import { useRouter } from 'next/router';
import { Container, Pagination, PaginationProps } from 'semantic-ui-react';

const ProductPagination = ({ page, totalPages }) => {
  const router = useRouter();
  const handlePageChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    pageInfo: PaginationProps
  ) => {
    const newPage = pageInfo.activePage;
    let url;
    if (newPage == 1) {
      url = '/';
    } else {
      url = `/?page=${newPage}`;
    }
    router.push(url);
  };

  return (
    <Container textAlign='center' style={{ marginTop: '1em' }}>
      <Pagination
        defaultActivePage={1}
        firstItem={null}
        lastItem={null}
        pointing
        secondary
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default ProductPagination;
