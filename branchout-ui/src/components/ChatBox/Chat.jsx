import React, { useState,useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {Paper, Grid, Divider, TextField, Typography, List, ListItem, ListItemText, Fab, Drawer, Box} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { Link as MuiLink } from '@mui/material';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // loading animation
    const [open, setOpen] = useState(false); // drawer state
    const [displayedMsg, setDisplayedMsg] = useState(''); // animated ai responses
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);
    const [showLoadingDots, setShowLoadingDots] = useState(false);
    const MCP_SERVER_URL = import.meta.env.VITE_MCP_SERVER_URL || 'localhost:8001'; // Use environment variable or default value

    const [chat, setChat] = useState([
        { from: 'Octocat', msg: 'Hey dev, whats up! Ask me more about a repository like stats, and how you can contribute, or ask about open issues & code snippets! Learn how to commit to what matters.', time: '10:00' },
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
        wsRef.current = new WebSocket(`wss://${MCP_SERVER_URL}/ws/chat`);

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
                        setChat((prevChat) => [...prevChat, { from: 'Octocat', msg: responseFromBackend, time: responseTime }]);
                        setDisplayedMsg('');
                        setIsTyping(false);
                    }
                    return nextText;
                });
            }, 20);
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
                <Box sx={{
                    width: { xs: '100%', sm: 420 },
                    height: { xs: '100dvh', sm: '80vh' },
                    display: 'flex',
                    flexDirection: 'column',
                }} >
                    <Grid container alignItems="center" justifyContent="space-between" sx={{
                        m: 1,
                        flexWrap: 'nowrap',
                        minHeight: '56px', // Give room on small screens
                    }}>
                        <Typography variant="h5">Ask Octocat!</Typography>
                        <Fab size="small" color="error" onClick={toggleDrawer(false)} sx={{
                            zIndex: 1500, 
                            position: 'relative' 
                        }}>
                            <CloseIcon color='primary.main'/>
                        </Fab>
                    </Grid>

                    <Grid container component={Paper} sx={{ flexGrow: 1, flexDirection: 'column', width: '100%' }}>
                        <Grid item xs={12}>
                            <List sx={{ height: '85vh', overflowY: 'auto' }}>
                                {chat.map((c, i) => (
                                    <ListItem key={i} sx={{ justifyContent: c.from === 'Octocat' ? 'flex-start' : 'flex-end' }}>
                                        <Paper elevation={3} sx={{
                                            p: 1, 
                                            bgcolor: c.from === 'ME' ? 'primary.main' : (theme) => theme.palette.grey,
                                            maxWidth: '70%',
                                            color: 'white',
                                            borderRadius: '12px', 
                                            textAlign: 'left',
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                            fontSize: '0.95rem',  
                                            lineHeight: 1.2,    
                                        }}>
                                            {c.from === 'Octocat' ? (
                                                <ReactMarkdown
                                                    components={{
                                                        a: ({ node, ...props }) => (
                                                            <MuiLink
                                                                {...props}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                sx={{
                                                                    wordBreak: 'break-word',
                                                                    overflowWrap: 'break-word',
                                                                    color: 'inherit',
                                                                    textDecoration: 'underline'
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                >
                                                    {c.msg}
                                            </ReactMarkdown>
                                            ) : (
                                                    <ReactMarkdown
                                                        components={{
                                                            a: ({ node, ...props }) => (
                                                                <MuiLink
                                                                    {...props}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{
                                                                        wordBreak: 'break-word',
                                                                        overflowWrap: 'break-word',
                                                                        color: 'inherit',
                                                                        textDecoration: 'underline'
                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    >
                                                        {c.msg}
                                                    </ReactMarkdown>
                                            )}
                                            <Typography variant="caption" sx={{
                                                display: 'block',
                                                textAlign: c.from === 'Octocat' ? 'left' : 'right',
                                                mt: 0.5, // reduce margin-top
                                                fontSize: '0.7rem', // smaller timestamp text
                                                lineHeight: 1,
                                            }}>
                                                {c.from} at {c.time}
                                            </Typography>
                                        </Paper>
                                    </ListItem>
                                ))}

                                {isTyping && (
                                    <ListItem sx={{ justifyContent: 'flex-start' }}>
                                        <Paper elevation={3} sx={{
                                            p: 1,
                                            maxWidth: '70%',
                                            color: 'white',
                                            borderRadius: '12px', 
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.2,
                                        }}>
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ node, ...props }) => (
                                                        <MuiLink
                                                            {...props}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{
                                                                wordBreak: 'break-word',
                                                                overflowWrap: 'break-word',
                                                                color: 'inherit',
                                                                textDecoration: 'underline'
                                                            }}
                                                        />
                                                    )
                                                }}
                                            >
                                                {displayedMsg}
                                            </ReactMarkdown>
                                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'left' }}>
                                                Octocat is typing...
                                            </Typography>
                                        </Paper>
                                    </ListItem>
                                )}

                                {showLoadingDots && (
                                    <ListItem sx={{ justifyContent: 'flex-start' }}>
                                        <Paper elevation={3} sx={{
                                            p: 1,
                                            maxWidth: '70%',
                                            bgcolor: 'gray', 
                                            color: 'white',
                                            borderRadius: '12px', 
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
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
                            <Grid container alignItems="flex-end" sx={{ padding: '20px', p: 2 }}>
                                <Box sx={{ flexGrow: 1, pr: 1 }}>
                                    <TextField
                                        onChange={handleChange}
                                        onKeyDown={keyPress}
                                        value={message}
                                        placeholder="Ask Octocat Something..."
                                        fullWidth
                                        multiline
                                        minRows={1}
                                        maxRows={6}
                                        sx={{
                                            bgcolor: 'gray',
                                            borderRadius: '20px',
                                            px: 2,
                                            boxShadow: 1,
                                            '& .MuiInputBase-root': {
                                                padding: '8px 16px'
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'transparent',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'transparent',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'transparent',
                                                    boxShadow: 'none'
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ flexShrink: 0 }}>
                                    <Fab
                                        color="secondary"
                                        onClick={() => addMessage('ME', message)}
                                        aria-label="send"
                                        size="small"
                                        disabled={loading || message.trim() === ''} // disable if loading or message is empty
                                    >
                                        <SendIcon />
                                    </Fab>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
        </>
    );
};

export default Chat;
