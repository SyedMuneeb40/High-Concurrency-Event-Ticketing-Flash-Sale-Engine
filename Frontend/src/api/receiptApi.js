import api from "./axios";


export const generateReceipt =
  async (
    bookingId,
    paymentMethod
  ) => {

    const response =
      await api.post(
        "/receipt/generate",
        {
          bookingId,
          paymentMethod,
        }
      );

    return response.data;
  };

