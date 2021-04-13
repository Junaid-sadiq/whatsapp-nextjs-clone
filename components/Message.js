import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

export default function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn?.email ? Sender : Receiver;

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <TimeStamp>{moment(message.timestamp).format('LT')}</TimeStamp>
            </TypeOfMessage>
        </Container>
    );
}

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 10px;
    border-radius: 10px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #054740;
    color: whitesmoke;
`;

const Receiver = styled(MessageElement)`
    text-align: left;
    background-color: #dcf8c6;
`;

const TimeStamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;
