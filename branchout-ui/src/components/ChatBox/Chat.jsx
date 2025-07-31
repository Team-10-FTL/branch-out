import React, { useState, useEffect, useRef } from 'react';
import {Paper, Grid, Divider, TextField, Typography, List, ListItem, ListItemText, Fab, Drawer, Box} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';

const Chat = () => {
    // ref: Ssali Jonathan "Building A Simple WebSocket Chat Application With FastAPI And JavaScript" YT link: https://www.youtube.com/watch?v=5o__C9wJHZA
    const ws = useRef(null); // websocket reference
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        // { from: 'AI', msg: 'Hey dev, Whats up! Ask me more about a repository, how you can contribute to that repository, ask about any open issues or about code snippets! The world is your oyster.', time: '10:00' },
    ]);

    // connecting to the websocket server
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/ws/chat');

        ws.current.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.current.onmessage = (event) => {
            const time = new Date().toLocaleTimeString().slice(0, 5);
            setChat((prevChat) => [...prevChat, { from: 'Octocat', msg: event.data, time }]);
            setTimeout(() => { // auto scroll to bottom 
                const chatList = document.querySelector('.MuiList-root');
                if (chatList) chatList.scrollTop = chatList.scrollHeight;
            }, 100);
        };

        ws.current.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        return () => {
            ws.current.close();
        };
    }, []);

    const [open, setOpen] = useState(false); // Drawer state

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    function handleChange(event) {
        setMessage(event.target.value);
    }

    function keyPress(e) {
        if (e.keyCode === 13) {
            addMessage('ME', message);
        }
    }

    function addMessage(from, msg) { 
        if (msg.trim() === '') return;

        const time = new Date().toLocaleTimeString().slice(0, 5);
        setChat((prevChat) => [...prevChat, { from, msg, time }]);
        setMessage('');
        setTimeout(() => { // auto scroll to bottom 
            const chatList = document.querySelector('.MuiList-root');
            if (chatList) chatList.scrollTop = chatList.scrollHeight;
        }, 100);

        // send  a msg to websocket server if from userr
        if (from === 'ME' && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(msg);
        }
    }

    return (
        <>
            {/* Floating Chat Button at Bottom-Right */}
            <Fab
                color="secondary"
                onClick={toggleDrawer(true)}
                sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}
            >
                <ChatIcon />
            </Fab>

            {/* Slide-in Drawer from Right */}
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 350, height: '100vh' }}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ m: 2 }}>Ask Octocat!</Typography>
                        </Grid>
                    </Grid>
                    <Grid container component={Paper} sx={{ width: '100%', height: '80vh' }}>
                        <Grid item xs={12}>
                            <List sx={{ height: '70vh', overflowY: 'auto' }}>
                                {chat.map((c, i) => (
                                    <ListItem key={i}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <ListItemText align={c.from === 'Octocat' ? 'left' : 'right'} primary={c.msg} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ListItemText align={c.from === 'Octocat' ? 'left' : 'right'} secondary={`${c.from} at ${c.time}`} />
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                            <Grid container sx={{ padding: '20px' }}>
                                <Grid item xs={11}>
                                    <TextField
                                        variant="standard"
                                        onChange={handleChange}
                                        onKeyDown={keyPress}
                                        value={message}
                                        placeholder="Type Something"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={1} sx={{ textAlign: 'right' }}>
                                    <Fab color="primary" onClick={() => addMessage('ME', message)} aria-label="send" size="small">
                                        <SendIcon />
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    );
};

export default Chat;
