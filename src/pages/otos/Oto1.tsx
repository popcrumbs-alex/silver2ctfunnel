import React, { FC, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Alert from "../../components/alert/Alert";
import OtoScreen from "../../components/otos/oto1/OtoScreen";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectOrderState } from "../../redux/reducers/order.reducer";
import BodyTags from "../layout/BodyTags";
import HelmetWrapper from "../layout/HelmetWrapper";
const Main = styled.main``;

declare const window: any;

const Globalstyle = createGlobalStyle`
    @import url("https://use.typekit.net/wzi3sml.css");
    html, body {
    font-family: new-order,sans-serif;
    font-weight: 400;
    font-style: normal; 
    font-size:16px;
    margin:0;
    padding:0;
    box-sizing:border-box;
}`;

const Oto1: FC = () => {
  const orderState = useAppSelector(selectOrderState);

  const {
    myOrder: { orderTotal },
  } = orderState;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.fbq) {
        console.log(window.fbq);
        window.fbq("track", "PageView");
      }
    }
  }, []);
  return (
    <Main>
      <HelmetWrapper
        pageTitle="1CT Gold Studs"
        efScript={`EF.conversion({offer_id: 75, amount: ${orderTotal}});`}
      />
      <Globalstyle />
      <Alert />
      <OtoScreen />
      <BodyTags />
    </Main>
  );
};

Oto1.propTypes = {};

export default Oto1;
