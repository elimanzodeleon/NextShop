import { IError } from '../interfaces/products';

export const handleError = (
  error: any,
  displayError: React.Dispatch<React.SetStateAction<IError>>
) => {
  let message: string;
  if (error.response) {
    // request was made but server responded with error code not within 2XX
    message = error.response.data.error;
  } else if (error.request) {
    // request was made but no response was received
    message = error.request.data;
  } else {
    // something else triggered the error
    message = error.message;
  }

  displayError({ isError: true, message: message });
};
