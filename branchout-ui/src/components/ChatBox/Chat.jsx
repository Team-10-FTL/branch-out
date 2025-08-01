import React, { useState,useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {Paper, Grid, Divider, TextField, Typography, List, ListItem, ListItemText, Fab, Drawer, Box} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';


const Chat = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // loading animation
    const [open, setOpen] = useState(false); // drawer state
    const [displayedMsg, setDisplayedMsg] = useState(''); // animated ai responses
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);
    const [showLoadingDots, setShowLoadingDots] = useState(false);

    const [chat, setChat] = useState([
        { from: 'AI', msg: 'Hey dev, Whats up! Ask me more about a repository, how you can contribute to that repository, ask about any open issues or about code snippets! The world is your oyster.', time: '10:00' },
    ]);

    const wsRef = useRef(null);

    <style>
        {`
    .dot {
        animation: blink 1.4s infinite both;
    }
    .dot:nth-child(2) {
        animation-delay: 0.2s;
    }
    .dot:nth-child(3) {
        animation-delay: 0.4s;
    }
    @keyframes blink {
        0% { opacity: 0.2; }
        20% { opacity: 1; }
        100% { opacity: 0.2; }
    }
`}
    </style>

    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:8000/ws/chat');

        wsRef.current.onopen = () => {
            console.log('WebSocket Connected');
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        return () => {
            wsRef.current.close();
        };
    }, []);

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

    async function addMessage(from, msg) {
        if (msg.trim() === '') return;

        const time = new Date().toLocaleTimeString().slice(0, 5);
        setChat((prevChat) => [...prevChat, { from, msg, time }]);
        setMessage('');

        if (from === 'ME') {
            setLoading(true);
            setShowLoadingDots(true); // Show loading dots

            const responseFromBackend = await sendMessageToBackend(msg);

            setShowLoadingDots(false); // remove loading dots once response arrives
            setLoading(false);
            setIsTyping(true);
            setDisplayedMsg(''); // reset typing effect
            await new Promise((resolve) => setTimeout(resolve, 0)); // wait next microtask (forces React to flush state)

            let i = 0;
            const typingInterval = setInterval(() => {
                setDisplayedMsg((prev) => {
                    const nextText = prev + responseFromBackend[i];
                    i++;
                    if (i >= responseFromBackend.length) {
                        clearInterval(typingInterval);
                        const responseTime = new Date().toLocaleTimeString().slice(0, 5);
                        setChat((prevChat) => [...prevChat, { from: 'AI', msg: responseFromBackend, time: responseTime }]);
                        setDisplayedMsg('');
                        setIsTyping(false);
                    }
                    return nextText;
                });
            }, 30);
        }
    }
    

    async function sendMessageToBackend(message) { // handle communication w websocket
        return new Promise((resolve, reject) => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(message);

                wsRef.current.onmessage = (event) => {
                    resolve(event.data);
                };

                wsRef.current.onerror = (error) => {
                    console.error('WebSocket Error:', error);
                    reject('Error in communication');
                };
            } else {
                reject('WebSocket is not open');
            }
        });
    }
    
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chat, loading, displayedMsg, isTyping]);
    

    return (
        <>
            {/* Floating Chat Button at Bottom-Right */}
            {!open && (
                <Fab
                    color="secondary"
                    onClick={toggleDrawer(true)}
                    sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}
                >
                    <ChatIcon />
                </Fab>
            )}


            {/* Slide-in Drawer from Right */}
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 350, height: '100vh', display: 'flex', flexDirection: 'column', p: 0, m: 0 }}>
            {/* <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ m: 2 }}>Ask Octocat!</Typography>
                        </Grid>
                    </Grid> */}
                    <Grid container alignItems="center" justifyContent="space-between" sx={{ m: 2 }}>
                        <Typography variant="h5">Ask Octocat!</Typography>
                        <Fab size="small" color="error" onClick={toggleDrawer(false)}>
                            <CloseIcon color='primary'/>
                        </Fab>
                    </Grid>

                    <Grid container component={Paper} sx={{ width: '100%', height: '80vh' }}>
                        <Grid item xs={12}>
                            <List sx={{ height: '70vh', overflowY: 'auto' }}>
                                {chat.map((c, i) => (
                                    <ListItem key={i} sx={{ justifyContent: c.from === 'AI' ? 'flex-start' : 'flex-end' }}>
                                        <Paper elevation={3} sx={{
                                            p: 1.5,
                                            maxWidth: '70%',
                                            bgcolor: c.from === 'AI' ? 'linear-gradient(135deg, #f3f3f3 0%, #e0e0e0 100%)' : 'primary.main',
                                            color: c.from === 'AI' ? 'white' : 'white',
                                            borderRadius: c.from === 'AI' ? '12px' : '20px',
                                        }}>
                                            {c.from === 'AI' ? (
                                                <ReactMarkdown>{c.msg}</ReactMarkdown>
                                            ) : (
                                                <Typography variant="body1">{c.msg}</Typography>
                                            )}
                                            <Typography variant="caption" sx={{ display: 'block', textAlign: c.from === 'AI' ? 'left' : 'right' }}>
                                                {c.from} at {c.time}
                                            </Typography>
                                        </Paper>
                                    </ListItem>
                                ))}

                                {isTyping && (
                                    <ListItem sx={{ justifyContent: 'flex-start' }}>
                                        <Paper elevation={3} sx={{
                                            p: 1.5,
                                            maxWidth: '70%',
                                            bgcolor: 'gray',
                                            color: 'white',
                                            borderRadius: '12px',
                                        }}>
                                            <Typography variant="body1">{displayedMsg}</Typography>
                                        </Paper>
                                    </ListItem>
                                )}
                                {showLoadingDots && (
                                    <ListItem sx={{ justifyContent: 'flex-start' }}>
                                        <Paper elevation={3} sx={{
                                            p: 1.5,
                                            maxWidth: '70%',
                                            bgcolor: 'gray',
                                            color: 'white',
                                            borderRadius: '12px',
                                        }}>
                                            <Typography variant="body1">
                                                <span className="dot">.</span>
                                                <span className="dot">.</span>
                                                <span className="dot">.</span>
                                            </Typography>
                                        </Paper>
                                    </ListItem>
                                )}

                                <div ref={bottomRef} />
                            </List>
                            <Divider />
                            <Grid container sx={{ padding: '20px', p:2 }}>
                                <Grid item xs={11} sx={{ pr: 1 }}>
                                    <TextField
                                        variant="outlined"
                                        onChange={handleChange}
                                        onKeyDown={keyPress}
                                        value={message}
                                        placeholder="Type your message..."
                                        fullWidth
                                        sx={{ bgcolor: 'gray', borderRadius: '20px', px: 2, boxShadow: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={1} sx={{ textAlign: 'right' }}>
                                    {/* <Fab color="secondary" onClick={() => addMessage('ME', message)} aria-label="send" size="small">
                                        <SendIcon />
                                    </Fab> */}
                                    <Fab
                                        color="secondary"
                                        onClick={() => addMessage('ME', message)}
                                        aria-label="send"
                                        size="small"
                                        disabled={loading || message.trim() === ''} // disable if loading or message is empty
                                    >
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
