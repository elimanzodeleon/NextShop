import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button, Label } from 'semantic-ui-react';

const ProductFeatures = ({ _id, description, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // bool for whether or not current user has permissions to delete products
  const deletePermissions =
    user && (user.role === 'admin' || user.role === 'root');

  const deleteProduct = async () => {
    setLoading(true);
    try {
      // delete method MUST have id in data object within body
      await axios.delete('/api/product', {
        data: {
          id: _id,
        },
      });
      setLabel('product deleted');

      // alert user that product was deleted then send them to home page after 0.5s
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      setLoading(false);
      setLabel('unable to delete product');
    }
  };

  return (
    <>
      <p>{description}</p>
      {deletePermissions && (
        <>
          <Button color='red' onClick={() => setIsModalOpen(true)}>
            delete item
          </Button>
          <Modal open={isModalOpen} dimmer='blurring'>
            {label && (
              <Modal.Content>
                <Label color='green'>{label}</Label>
              </Modal.Content>
            )}
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              Are you sure you want to delete this product?
            </Modal.Content>

            <Modal.Actions>
              <Button
                content='cancel'
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              />
              <Button
                content='delete'
                color='red'
                onClick={deleteProduct}
                disabled={loading}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProductFeatures;
