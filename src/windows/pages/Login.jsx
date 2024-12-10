import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import "./Login.css";
import logo from "./shrek-carros.png";

function Login() {
    const [tokenName, setTokenName] = useState("Carregando..."); // Estado para armazenar o tokenName
    const loginRef = useRef();
    const animate = useRef();
    const loginPage = useRef();

    // Chave de acesso e URL da API
    const accessKey = 'A1qQaAA9kdfnn4Mmn44bpoieIYHKkdghFKUD1978563llakLLLKdfslphgarcorc3haeogmmMNn243wf';

    // Função para buscar o tokenName da API
    useEffect(() => {
        const fetchTokenName = async () => {
            try {
                const response = await axios.get('https://interca.onrender.com/api/purchaseData', {
                    headers: {
                        'x-access-key': accessKey,
                    },
                });
                setTokenName(response.data.tokenName); // Armazena o tokenName no estado
            } catch (error) {
                console.error('Erro ao buscar o token name:', error);
                setTokenName("Erro ao carregar"); // Exibe uma mensagem de erro em caso de falha
            }
        };

        fetchTokenName(); // Chama a função para buscar o tokenName quando o componente monta
    }, []);

    // Função para manipular o login
    function loginF() {
        if (loginRef.current && animate.current && loginPage.current) {
            loginRef.current.style.display = "none";
            animate.current.style.display = "flex";

            // Mudar loginPage para display: flex
            loginPage.current.style.display = "flex";

            // Manter por 2 segundos e depois ocultar
            setTimeout(() => {
                loginPage.current.style.display = "none";
            }, 2000); // 2000 milissegundos = 2 segundos
        }
    }

    return (
        <div ref={loginPage} className="Login">
            <div onClick={loginF} ref={loginRef} className="user">
                <div className="icon">
                    <img src={logo} alt="" />
                </div>
                <div className="name">{tokenName}</div> {/* Exibe o tokenName aqui */}
            </div>
            <div ref={animate} className="load">
                <div className="name">Logging</div>
                <div className="animation" />
            </div>
        </div>
    );
}

export default Login;
