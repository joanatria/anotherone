import { styled } from "styled-components"

const Container = styled.div`
    height: 30px;
    background-color: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
`

const Announcement = () => {
  return (
    <Container>
        Be more productive with Apple. Enjoy exclusive discounts here 🛒
    </Container>
  )
}

export default Announcement
