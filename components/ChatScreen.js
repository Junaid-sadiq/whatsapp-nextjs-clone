import React, { useState, useRef, useEffect } from 'react';
import {
    AttachFile,
    MicOutlined,
    MoreVert,
    Cancel,
    SearchOutlined,
    InsertEmoticonOutlined,
} from '@material-ui/icons';
import SendIcon from '@material-ui/icons/Send';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@material-ui/core';
import Message from './Message';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';

import TimeAgo from 'timeago-react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

export default function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    // const [open, setOpen] = useState(false);
    const [emoji, setEmoji] = useState(false);
    const recipientEmail = getRecipientEmail(chat.users, user);
    const endOfMessagesRef = useRef(null);
    const [toggler, setToggler] = useState(true);
    const router = useRouter();

    const addEmoji = (e) => {
        let emoji = e.native;
        setInput(input + emoji);
    };
    const checkEmojiClose = () => {
        if (emoji) {
            setEmoji(false);
        }
    };
    const [messagesSnapshot] = useCollection(
        db
            .collection('chats')
            .doc(router.query.id)
            .collection('messages')
            .orderBy('timestamp', 'asc'),
    );
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', recipientEmail),
    );

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ));
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
        );

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput('');
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    return (
        <Container>
            <Header>
                {recipient ? (
                    <IconButton title="Message Receiver">
                        <Avatar
                            src={recipient?.photoURL}
                            onClick={() => router.push('/')}
                        />
                    </IconButton>
                ) : (
                    <IconButton title="Message Receiver">
                        <Avatar>{recipientEmail[0]}</Avatar>
                    </IconButton>
                )}
                <HeaderInformation title="Receiver's Email Address">
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p title="Last Seen">
                            Last action:{' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo
                                    datetime={recipient?.lastSeen?.toDate()}
                                />
                            ) : (
                                'Unavailable'
                            )}
                        </p>
                    ) : (
                        <p>Loading last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton aria-label="Search Icon" title="Search">
                        <SearchOutlined />
                    </IconButton>
                    <IconButton aria-label="Attach files Icon" title="Attach">
                        <AttachFile />
                    </IconButton>
                    <IconButton
                        aria-label="More Options Icon"
                        title="More Options"
                    >
                        <MoreVert />
                    </IconButton>
                    <IconButton
                        aria-label="Close this window icon"
                        title="Close Window"
                    >
                        <Cancel onClick={() => router.push('/')} />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>

            <InputContainer>
                <IconButton title="Emoji">
                    <InsertEmoticonOutlined onClick={() => setEmoji(!emoji)} />
                    {emoji ? (
                        <Picker
                            className="emoji-mart"
                            showPreview={false}
                            showSkinTones={false}
                            onSelect={addEmoji}
                            emojiSize={20}
                            theme="dark"
                        />
                    ) : null}
                </IconButton>
                <IconButton title="upload">
                    <AttachFile />
                </IconButton>
                <Input
                    value={input}
                    type="text"
                    placeholder="Type a message"
                    onChange={(e) => setInput(e.target.value)}
                    onClick={checkEmojiClose}
                />

                <button
                    hidden
                    disabled={!input}
                    type="submit"
                    onClick={sendMessage}
                >
                    Send Message
                    <IconButton>
                        <SendIcon onClick={sendMessage} title="Send Message" />
                    </IconButton>
                </button>
                <IconButton>
                    <MicOutlined />
                </IconButton>
            </InputContainer>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0.65;
`;

const Header = styled.div`
    position: sticky;
    background-color: #2a2f32;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #2a2f32;
    .MuiSvgIcon-root {
        color: gray;
    }
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3 {
        margin-bottom: 3px;
        color: white;
        font-weight: 500;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background: url('../PicsArt_09-02-05.13.53.jpg');
    min-height: 90vh;
    overflow-x: hidden;
    background-position: center;
    background-image: repeat;
    scroll-behavior: smooth;
    opacity: 0.7;
    height: 120px;
    width: 100%;
    top: 60px;
    padding: 10px 20px;
    background-size: contain;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    position: sticky;
    position: relative;
    bottom: 0;
    height: 62px;
    background-color: #1e2428;
    z-index: 100;

    .emoji-mart {
        position: absolute !important;
        top: -800%;
        z-index: 999;
        left: 0;
        width: 30vw !important;
    }

    .MuiSvgIcon-root {
        color: gray;
    }
`;

const Input = styled.input`
    flex: 1;
    padding: 0 20px;
    height: 40px;
    bottom: 0;
    outline: 0;
    border: none;
    border-radius: 50px;
    margin: 20px 15px;
    background-color: #323739;
    color: white;
`;
