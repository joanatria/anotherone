import { Send } from '@mui/icons-material';
import styled from "styled-components";
import emailjs from 'emailjs-com';

const Container = styled.div`
  height: 60vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 20px;
`;

const Desc = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20px;
`;

const InputContainer = styled.form`
  width: 50%;
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
`;

const Button = styled.button`
  flex: 1;
  border: none;
  background-color: black;
  color: white;
`;

const Newsletter = () => {
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_eccrq4r', 'template_acm84ll', e.target, 'Ime8DhelVtHYCGMCR')
      .then((result) => {
        console.log('Email sent successfully!');
        // You can add further logic here, such as showing a success message to the user.
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        // You can handle the error here, such as displaying an error message to the user.
      });

    e.target.reset();
  };

  return (
    <Container>
      <Title>Newsletter</Title>
      <Desc>Get timely updates from your favorite products.</Desc>
      <InputContainer onSubmit={sendEmail}>
        <Input type="email" name="email" placeholder="Your email" required />
        <Button type="submit">
          <Send />
        </Button>
      </InputContainer>
    </Container>
  );
};

export default Newsletter;
