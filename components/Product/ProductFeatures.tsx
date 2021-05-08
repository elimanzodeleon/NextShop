import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button, Label } from 'semantic-ui-react';

const ProductFeatures = ({ _id, name, price, sku, description, mediaUrl }) => {
  const admin = true; // use global state to see if the current user has admin priveledges
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState('');
  const router = useRouter();

  const deleteProduct = async () => {
    try {
      // delete method MUST have id in data object within body
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product`,
        {
          data: {
            id: _id,
          },
        }
      );
      setLabel('product deleted');
      // alert user that product was deleted then send them to home page after 0.5s
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error) {
      setLabel('unable to delete product');
    }
  };

  return (
    <>
      <p>{description}</p>
      {admin && (
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
              <Button content='cancel' onClick={() => setIsModalOpen(false)} />
              <Button content='delete' color='red' onClick={deleteProduct} />
            </Modal.Actions>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProductFeatures;
