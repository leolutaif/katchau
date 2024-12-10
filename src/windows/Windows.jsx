import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './Windows.css';
import Login from './pages/Login';
import wb from "./wb.png";
import logo from "./shrek-carros.png";
import telegramIcon from "./tele.png";
import xIcon from "./xicon.avif";
import pumpIcon from "./pumppp.png";

function Windows() {
    const [open, setOpen] = useState(true);
    const [minimized, setMinimized] = useState(false);
    const [maximized, setMaximized] = useState(false);
    const [position, setPosition] = useState({ x: '10%', y: '10%' });
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [profitChance, setProfitChance] = useState(92);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    const [apiData, setApiData] = useState(null);

    const accessKey = 'A1qQaAA9kdfnn4Mmn44bpoieIYHKkdghFKUD1978563llakLLLKdfslphgarcorc3haeogmmMNn243wf';

    // Função de animação de digitação
    const typeMessage = (message, callback) => {
        setIsTyping(true);
        let index = 0;
        let newMessage = '';

        const interval = setInterval(() => {
            newMessage += message[index];
            index++;

            setOutput((prev) => {
                const newOutput = [...prev];
                if (newOutput.length === 0 || typeof newOutput[newOutput.length - 1] !== 'string') {
                    newOutput.push(newMessage);
                } else {
                    newOutput[newOutput.length - 1] = newMessage;
                }
                return newOutput;
            });

            if (index >= message.length) {
                clearInterval(interval);
                setIsTyping(false);
                if (callback) callback();
            }
        }, 50);
    };

    // Busca dados da API quando o terminal é aberto
    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const response = await axios.get('https://interca.onrender.com/api/purchaseData', {
                    headers: {
                        'x-access-key': accessKey,
                    },
                });
                setApiData(response.data);
                displayMenu(response.data.tokenName);
            } catch (error) {
                console.error('Erro ao buscar os dados do token:', error);
            }
        };

        if (open && !apiData) {
            fetchTokenData();
        }
    }, [open, apiData]);

    // Calcula a chance de lucro com flutuações aleatórias
    useEffect(() => {
        const interval = setInterval(() => {
            setProfitChance(Math.floor(Math.random() * (100 - 92 + 1)) + 92);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    // Lida com comandos de entrada
    const handleCommand = (e) => {
        if (e.key === 'Enter' && !isTyping) {
            const choice = input.trim().toLowerCase();
            let response = '';

            setOutput((prev) => [...prev, `> ${input}`]);

            if (choice === 'menu') {
                displayMenu(apiData ? apiData.tokenName : 'TerminalDog');
                setInput('');
                return;
            }

            switch (choice) {
                case '1':
                    response = `${apiData ? apiData.tokenCA : 'Carregando...'} - Type 'copy' to copy the Token CA or visit: ${apiData ? apiData.link : '#'}`;
                    typeMessage(response);
                    break;
                case 'copy':
                    navigator.clipboard.writeText(apiData ? apiData.tokenCA : 'Token indisponível');
                    response = 'Token CA copied to clipboard!';
                    typeMessage(response);
                    break;
                case '2':
                    response = `Token profit chance: ${profitChance}%`;
                    typeMessage(response);
                    break;
                case '3':
                    response = `Twitter: ${apiData ? apiData.twitterLink : 'Carregando...'}\nTelegram: ${apiData ? apiData.telegramLink : 'Carregando...'}\nPumpFun: ${apiData ? apiData.link : 'Carregando...'}`;
                    typeMessage(response);
                    break;
                case '4':
                    response = 'Closing the terminal...';
                    typeMessage(response, () => {
                        setOpen(false);
                    });
                    break;
                default:
                    response = 'Invalid command, please choose a number from the menu.';
                    typeMessage(response);
            }

            setInput('');
        }
    };

    // Exibe o menu
    const displayMenu = (tokenName) => {
        const menuText = `Hello, I am ${tokenName}, this is my terminal. What would you like to know?\n1. Token CA\n2. Token profit chance\n3. Social Media\n4. Close terminal`;
        setOutput((prev) => [...prev, '']);
        typeMessage(menuText);
    };

    // Foca no input ao clicar no terminal
    const handleTerminalClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Funcionalidade de arrastar
    const [dragging, setDragging] = useState(false);
    const [relPosition, setRelPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('.head')) {
            setDragging(true);
            const rect = terminalRef.current.getBoundingClientRect();
            setRelPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            e.preventDefault();
        }
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (dragging) {
            const parentRect = terminalRef.current.parentElement.getBoundingClientRect();
            let newX = e.clientX - relPosition.x - parentRect.left;
            let newY = e.clientY - relPosition.y - parentRect.top;

            // Mantém o terminal dentro do contêiner pai
            const terminalWidth = terminalRef.current.offsetWidth;
            const terminalHeight = terminalRef.current.offsetHeight;
            const containerWidth = parentRect.width;
            const containerHeight = parentRect.height;

            newX = Math.max(0, Math.min(newX, containerWidth - terminalWidth));
            newY = Math.max(0, Math.min(newY, containerHeight - terminalHeight));

            setPosition({
                x: `${(newX / containerWidth) * 100}%`,
                y: `${(newY / containerHeight) * 100}%`,
            });
            e.preventDefault();
        }
    }, [dragging, relPosition]);

    const handleMouseUp = useCallback(() => {
        setDragging(false);
    }, []);

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, handleMouseMove, handleMouseUp]);

    // Lida com ações de minimizar, maximizar e fechar
    const handleMaximize = () => {
        setMaximized(!maximized);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="windows" style={{ maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }}>
            {open && !minimized && (
                <div
                    ref={terminalRef}
                    className={`pageTerminal ${maximized ? 'maximized' : ''}`}
                    onClick={handleTerminalClick}
                    style={{
                        left: maximized ? '0' : position.x,
                        top: maximized ? '0' : position.y,
                    }}
                >
                    <div className="head" onMouseDown={handleMouseDown}>
                        <div className="nameaba">{apiData ? apiData.tokenName : 'TerminalDog'}</div>
                        <div className="abas">
                            <div onClick={handleClose} className="icon-x">-</div>
                            <div onClick={handleMaximize} className="icon-x quad">{maximized ? '🗗' : '🗖'}</div>
                            <div onClick={handleClose} className="icon-x xis">x</div>
                        </div>
                    </div>
                    <div className="code">
                        {output.map((line, index) => (
                            <div key={index} className="message">{line}</div>
                        ))}
                        {isTyping ? <div className="loading">Typing...</div> : null}
                        <div className="input-line">
                            <span className="prompt">&gt;</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleCommand}
                                className="input"
                                ref={inputRef}
                                autoFocus
                            />
                        </div>
                    </div>
                </div>
            )}
            <Login />
            <div className="line"></div>
            <div className="bt"></div>
            <div className="trueBt">
                <img src={wb} alt="" />
                <img
                    onClick={() => {
                        setOpen(true);
                        setMinimized(false);
                    }}
                    className="logopng"
                    src={logo}
                    alt=""
                />
                <a href={apiData ? apiData.telegramLink : "#"} target="_blank" rel="noopener noreferrer">
                    <img className="logopng" src={telegramIcon} alt="" />
                </a>
                <a href={apiData ? apiData.twitterLink : "#"} target="_blank" rel="noopener noreferrer">
                    <img className="logopng" src={xIcon} alt="" />
                </a>
                <a href={apiData ? apiData.link : "#"} target="_blank" rel="noopener noreferrer">
                    <img className="logopng" src={pumpIcon} alt="" />
                </a>
            </div>
        </div>
    );
}

export default Windows;
