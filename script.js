document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const menuMobile = document.querySelector('.menu-mobile');
    const nav = document.querySelector('.header nav');

    menuMobile.addEventListener('click', () => {
        nav.classList.toggle('ativo');
        menuMobile.querySelector('i').classList.toggle('fa-bars');
        menuMobile.querySelector('i').classList.toggle('fa-times');
    });

    // Fecha o menu mobile ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('ativo');
            menuMobile.querySelector('i').classList.remove('fa-times');
            menuMobile.querySelector('i').classList.add('fa-bars');
        });
    });

    // Marca o link ativo baseado na seção atual
    function marcarLinkAtivo() {
        const links = document.querySelectorAll('.nav-link');
        const hash = window.location.hash || '#home';

        links.forEach(link => {
            link.classList.remove('ativo');
            if (link.getAttribute('href').includes(hash)) {
                link.classList.add('ativo');
            }
        });
    }

    // Atualiza link ativo ao rolar a página
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                const id = section.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('ativo');
                    if (link.getAttribute('href').includes(id)) {
                        link.classList.add('ativo');
                    }
                });
            }
        });
    });

    // Scroll suave para as seções
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Atualiza o contador do carrinho
    function atualizarContadorCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const contador = document.querySelector('.carrinho-contador');
        if (contador) {
            const quantidade = carrinho.reduce((total, item) => total + item.quantidade, 0);
            contador.textContent = quantidade;
        }
    }

    // Filtros Rápidos
    const filtros = document.querySelectorAll('.filtro-btn');
    const produtos = document.querySelectorAll('.produto-card');

    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            // Remove classe ativo de todos os filtros
            filtros.forEach(f => f.classList.remove('ativo'));
            // Adiciona classe ativo ao filtro clicado
            filtro.classList.add('ativo');

            const tipo = filtro.textContent.toLowerCase();

            produtos.forEach(produto => {
                const tag = produto.querySelector('.produto-tag');
                if (tipo === 'todos') {
                    produto.style.display = 'block';
                } else if (tipo === 'promoções' && tag?.classList.contains('promocao')) {
                    produto.style.display = 'block';
                } else if (tipo === 'novidades' && tag?.classList.contains('novo')) {
                    produto.style.display = 'block';
                } else if (tipo === 'mais vendidos' && tag?.classList.contains('mais-vendido')) {
                    produto.style.display = 'block';
                } else {
                    produto.style.display = 'none';
                }
            });
        });
    });

    // Formulário de Solicitação
    const formSolicitar = document.getElementById('form-solicitar');
    if (formSolicitar) {
        formSolicitar.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(formSolicitar);
            const dados = Object.fromEntries(formData);

            alert('Solicitação enviada com sucesso!\nEntraremos em contato em breve.');
            formSolicitar.reset();
        });
    }

    // Atualizar contador do carrinho ao carregar a página
    atualizarContadorCarrinho();

    // Adicionar evento de clique aos botões "Adicionar ao Carrinho"
    document.querySelectorAll('.btn-adicionar').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.produto-card');
            const nome = card.querySelector('h3').textContent;
            const descricao = card.querySelector('p:not(.produto-preco)').textContent;
            const precoElement = card.querySelector('.preco-promocional') || card.querySelector('.produto-preco');
            const preco = parseFloat(precoElement.textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));
            const precoOriginalElement = card.querySelector('.preco-original');
            const precoOriginal = precoOriginalElement ? precoOriginalElement.textContent : null;
            
            // Definir imagem baseada no produto
            let imagem;
            if (nome.toLowerCase().includes('smartphone')) {
                imagem = 'https://placehold.co/300x300/1a1a1a/FFFFFF?text=Smartphone';
            } else if (nome.toLowerCase().includes('smartwatch')) {
                imagem = 'https://placehold.co/300x300/1a1a1a/FFFFFF?text=Smartwatch';
            } else if (nome.toLowerCase().includes('fone')) {
                imagem = 'https://placehold.co/300x300/1a1a1a/FFFFFF?text=Fone+Bluetooth';
            } else if (nome.toLowerCase().includes('tablet')) {
                imagem = 'https://placehold.co/300x300/1a1a1a/FFFFFF?text=Tablet';
            }

            const produto = {
                nome,
                descricao,
                preco,
                precoOriginal,
                imagem,
                quantidade: 1
            };

            adicionarAoCarrinho(produto);
            mostrarNotificacao('Produto adicionado ao carrinho!');
        });
    });

    // Função para adicionar ao carrinho
    function adicionarAoCarrinho(produto) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        // Verificar se o produto já existe no carrinho
        const produtoExistente = carrinho.find(item => item.nome === produto.nome);
        
        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            carrinho.push(produto);
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();
    }

    // Função para mostrar notificação
    function mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao';
        notificacao.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${mensagem}</p>
        `;
        document.body.appendChild(notificacao);

        // Adicionar classe para animar
        setTimeout(() => notificacao.classList.add('mostrar'), 100);

        // Remover notificação após 3 segundos
        setTimeout(() => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    // Adicionar estilos da notificação dinamicamente
    const style = document.createElement('style');
    style.textContent = `
        .notificacao {
            position: fixed;
            top: 20px;
            right: -300px;
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notificacao.mostrar {
            right: 20px;
        }

        .notificacao i {
            font-size: 1.5rem;
        }

        .notificacao p {
            margin: 0;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);

    // Inicializa as funções
    marcarLinkAtivo();
    atualizarContadorCarrinho();
}); 