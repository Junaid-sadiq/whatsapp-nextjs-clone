import styled from 'styled-components';
import Head from 'next/head';
import { Button } from '@material-ui/core';
import { auth, provider } from '../firebase';

export default function Login() {
    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    };
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo
                    /* src="https://www.transparentpng.com/thumb/whatsapp/NfnHoW-whatsapp-web-app-logo-cut-out.png" */
                    /* src="https://www.transparentpng.com/thumb/whatsapp/LhZ97X-whatsapp-hd-image.png" */
                    src="https://pngmind.com/wp-content/uploads/2019/08/Whatsapp-Logo-No-Background.png"
                    /* src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" */
                    /* src="https://logos-world.net/wp-content/uploads/2020/05/WhatsApp-Emblem.png" */
                    alt="whatsapp"
                />
                <LogoButton onClick={signIn} variant="outlined">
                    Sign in with Google
                </LogoButton>
            </LoginContainer>
        </Container>
    );
}

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #131c21;
    z-index: 3;
    transition: ease 0.3s;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
`;

const Logo = styled.img`
    position: absolute;
    height: 150px;
    margin: auto;
    right: 0;
    left: 0;
    top: 30%;
    margin-bottom: 100px;
`;

const LogoButton = styled(Button)`
    &&& {
        position: absolute;
        height: 40px;
        margin: auto;
        right: 0;
        left: 0;
        top: 50%;
        cursor: pointer;
        background-color: #075e54;
        color: white;
        margin-top: 100px;
        font-weight: 600;
        :hover {
            background-color: #00e676;
        }
    }
`;
