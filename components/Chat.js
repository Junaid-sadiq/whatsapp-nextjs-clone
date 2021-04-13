import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function Chat({ id, users }) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(
        db
            .collection('users')
            .where('email', '==', getRecipientEmail(users, user)),
    );

    const enterChat = () => {
        router.push(`/chat/${id}`);
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data;
    const recipientEmail = getRecipientEmail(users, user);

    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
            ) : (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )}
            <p>{recipientEmail}</p>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    color: white;
    border-bottom: 1px solid #2a2f32;
    color: white;

    :hover {
        background-color: hsl(180, 2%, 21%);
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;

    :hover {
        opacity: 0.8;
    }
`;
