import styled from 'styled-components';
import { Avatar, IconButton, Button } from '@material-ui/core';
import { ExitToApp, DonutLarge } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';

import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Chat from './Chat';
import { useRouter } from 'next/router';
/* import Popup from 'reactjs-popup';
import { slide as Menu } from 'react-burger-menu'; */

export default function Sidebar() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const userChatRef = db
        .collection('chats')
        .where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const email = prompt('Provide a email to start a conversation.');

        if (!email) return null;

        if (
            EmailValidator.validate(email) &&
            !loading &&
            !chatAlreadyExists(email) &&
            email !== user.email
        ) {
            db.collection('chats').add({
                users: [user.email, email],
            });
        } else {
            alert('Please enter a valid email!');
        }
    };

    const chatAlreadyExists = (recipientEmail) =>
        !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user) => user === recipientEmail)
                    ?.length > 0,
        );

    return (
        <Container>
            <Header>
                <IconButton>
                    <UserAvatar
                        src={user.photoURL}
                        onClick={() => router.push('/')}
                    />
                </IconButton>
                <IconsContainer>
                    <IconButton>
                        <DonutLarge title="Status" />
                    </IconButton>
                    <IconButton>
                        <ChatIcon title="Chat" />
                    </IconButton>
                    <IconButton title="Sign out" onClick={() => auth.signOut()}>
                        <ExitToApp />
                    </IconButton>
                </IconsContainer>
            </Header>
            <SearchContainer>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder="Search the chat" />
                </Search>
            </SearchContainer>
            <Searchbutton onClick={createChat}>Start A New Chat</Searchbutton>
            {/*List of Chats */}
            {chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    );
}

const Container = styled.div`
    flex: 0;
    border-right: 1px solid #2a2f32;
    height: 100vh;
    min-width: 350px;
    max-width: 350px;
    overflow-y: scroll;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div`
    &&& {
        color: white;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background-color: #2a2f32;
    border-bottom: 1px solid #2a2f32;
    z-index: 1;
    padding: 15px;
    height: 80px;
    width: 100%;

    .MuiSvgIcon-root {
        color: gray;
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #1e2428;
    border-bottom: 1px solid #2a2f32;
    height: 60px;
    padding: 20px;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    background-color: #fff;
    width: 100%;
    height: 35px;
    border-radius: 20px;
    background-color: #323739;
    margin-top: 10px;
    margin-bottom: 10px;
    .MuiSvgIcon-root {
        color: gray;
    }
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: 0;
    flex: 1;
    align-items: center;
    background-color: #323739;
    outline: none;
    color: #fff;
`;

const Searchbutton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid #2a2f32;
        border-bottom: 1px solid #2a2f32;
        color: white;
        font-weight: 600;
        :hover {
            background-color: hsl(160, 81%, 41%);
        }
    }
`;
