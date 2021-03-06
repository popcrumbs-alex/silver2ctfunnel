import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CREATE_ORDER } from "../../../graphql/mutations/order.mutation";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { setAlert, setFormError } from "../../../redux/reducers/alert.reducer";
import {
  addOrderToStorage,
  OrderStateProps,
  selectOrderState,
} from "../../../redux/reducers/order.reducer";
import { InputSelector } from "../../../reusable/Inputs";
import { navigate } from "gatsby";
import LoadingSpinner from "../../loading/LoadingSpinner";
import ProductData from "../../../product/ProductData";

const Container = styled.form`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
`;
const Column = styled.div`
  display: flex;
  width: 100%;
  @media screen and (max-width: 760px) {
    width: auto;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media screen and (max-width: 760px) {
    display: flex;
    gap: 0;
    flex-direction: column;
  }
`;

const Button = styled.button`
  background-color: #111;
  color: #fff;
  border-radius: 5px;
  padding: 1rem;
  border: 0;
  font-weight: 700;
  margin-top: 10px;
  font-size: 1.2rem;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 20px #44444420;
  &:hover {
    cursor: pointer;
    background-color: #333;
  }
  & span {
    font-size: 0.9rem;
    font-weight: 300;
    color: #666;
    margin-top: 10px;
  }
  @media screen and (max-width: 760px) {
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

type CardStateProps = {
  creditCardNumber: string;
  expiry: string;
  cvc: string;
};

const CreditCardForm = () => {
  //redux dispatch action
  const dispatch = useAppDispatch();

  const orderState = useAppSelector(selectOrderState);

  const ef_aff_id =
    typeof window !== "undefined"
      ? window.localStorage.getItem("ef_aff_id")
      : null;

  const [cardForm, setCardFormState] = useState<CardStateProps>({
    creditCardNumber: "",
    expiry: "",
    cvc: "",
  });

  //graphql data
  const [createOrder, { error, data, loading }] = useMutation(CREATE_ORDER);

  const { creditCardNumber, expiry, cvc } = cardForm;

  const handleCardNumber = (e: React.FormEvent<HTMLInputElement>) =>
    setCardFormState({ ...cardForm, creditCardNumber: e.currentTarget.value });

  const handleExpiry = (e: React.FormEvent<HTMLInputElement>) => {
    const removeLetters = new RegExp(/[0-9]|\//, "g");

    //Step1. allow only numbers in input
    const filtered = e.currentTarget.value.match(removeLetters) || [""];
    //Step2. split the input in two with a backslash in the middle
    let tempArr = [];

    tempArr.push(...filtered);

    //this works because state is behind by one.
    //Main issue is when deleting the input(backtracking caused infinite loop of rendering backslash)
    if (tempArr.length == 2 && expiry.length < 2) {
      tempArr.splice(2, 0, "/");
    }
    if (filtered !== undefined && tempArr.length < 6) {
      setCardFormState({ ...cardForm, expiry: tempArr.join("") });
    }
  };

  const handleCVC = (e: React.FormEvent<HTMLInputElement>) =>
    e.currentTarget.value.split("").length < 6 &&
    setCardFormState({ ...cardForm, cvc: e.currentTarget.value });

  const handleAnyFormError = async (formData: OrderStateProps) => {
    const { myOrder } = formData;

    //combine data to single object in order to loop through
    const objectToCheckForErrors = {
      ...myOrder.contactInfo,
      ...myOrder.shippingInfo,
    };

    try {
      for (let formField in objectToCheckForErrors) {
        ////////////////////////////////////////////////
        if (objectToCheckForErrors[formField] === "") {
          //set alert to focus on one specific form element
          dispatch(setFormError(formField));
        }
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const submitOrder = async (
    e: React.FormEvent<HTMLButtonElement> | React.FormEvent
  ) => {
    e.preventDefault();

    try {
      //first make sure to handle any front end form errors that don't require backend validation
      await handleAnyFormError(orderState);

      const cardInfo = {
        creditCardNumber: creditCardNumber.replace(/\s/g, ""),
        expiry: expiry.replace(/\//g, ""),
        cvc: cvc,
      };

      const { funnel_name } = ProductData;

      const response = await createOrder({
        variables: {
          createOrderInput: {
            ...orderState.myOrder.contactInfo,
            ...orderState.myOrder.shippingInfo,
            products: [...orderState.myOrder.products],
            orderTotal: orderState.myOrder.orderTotal,
            ...cardInfo,
            ef_aff_id: ef_aff_id ? ef_aff_id : "non-ef-order",
            orderType: "credit",
            funnel_name,
          },
        },
      });
      if (response.data.createOrder.success) {
        //need to set the order id in storage in order to load it in the next steps
        dispatch(
          addOrderToStorage({ id: response.data.createOrder.Order._id })
        );

        //set order type for oto process to credit
        window.localStorage.setItem("orderType", "credit");

        navigate("/otos/Oto1");
      }
      console.log("response", response);
    } catch (error) {
      console.error("error creating order:", error);
      return error;
    }
  };

  //if theres an error porcessing order, send alert to redux store
  useEffect(() => {
    if (error) {
      dispatch(setAlert({ message: error.message, type: "danger" }));
    }
  }, [error]);

  return (
    <Container onSubmit={(e) => submitOrder(e)}>
      <Row>
        <InputSelector
          label="Credit Card Number*"
          placeholder="Card Number"
          isRequired={true}
          value={creditCardNumber}
          callback={handleCardNumber}
          name="creditCardNumber"
          type="cleaveinput"
          options={null}
          labelStyle={null}
          inputStyle={null}
        />
      </Row>
      <Grid>
        <Column>
          <InputSelector
            label="Expiry*"
            placeholder="MM/YY"
            type="text"
            isRequired={true}
            value={expiry}
            callback={handleExpiry}
            name="expiry"
            options={null}
            labelStyle={null}
            inputStyle={null}
          />
        </Column>
        <Column>
          <InputSelector
            label="CVC Code*"
            placeholder="123"
            type="text"
            isRequired={true}
            value={cvc}
            callback={handleCVC}
            name="cvc"
            inputStyle={null}
            labelStyle={null}
            options={null}
          />
        </Column>
      </Grid>
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p style={{ marginLeft: "20px" }}>Processing Order</p>
        </LoadingContainer>
      ) : (
        <Button onSubmit={(e) => submitOrder(e)}>
          Submit My Order For RUSH Shipping
          <span>Click Here</span>
        </Button>
      )}
    </Container>
  );
};

export default CreditCardForm;
