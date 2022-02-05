import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Footer from "../components/footer.tsx/Footer";
import Hero from "../components/orderpage/hero/Hero";
import Nav from "../components/orderpage/nav/Nav";
import Form from "../components/orderpage/order-form/Form";
import Message from "../components/orderpage/section/Message";
import Colors from "../constants/Colors";
import { Helmet } from "react-helmet";
import Loox from "../components/reviews/Loox";
import Alert from "../components/alert/Alert";

const Main = styled.main``;

export const ThemeContext = React.createContext(Colors);

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

const IndexPage = () => {
  return (
    <ThemeContext.Provider value={Colors}>
      <Globalstyle />
      <Helmet>
        <script
          async
          src="//loox.io/widget/loox.js?shop=luciana-rose-couture.myshopify.com"
        ></script>
      </Helmet>
      <Nav />
      <Main>
        <Alert />
        <Hero />
        <Message />
        <Form />
        <Loox />
        <Footer />
      </Main>
    </ThemeContext.Provider>
  );
};

export default IndexPage;
