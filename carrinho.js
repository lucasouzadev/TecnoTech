document.addEventListener('DOMContentLoaded', () => {
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const carrinhoConteudo = document.getElementById('carrinho-conteudo');
    const carrinhoItems = document.querySelector('.carrinho-items');
    const subtotalElement = document.getElementById('subtotal');
    const freteElement = document.getElementById('frete');
    const totalElement = document.getElementById('total');
    const btnAplicarCupom = document.getElementById('aplicar-cupom');
    const cupomInput = document.getElementById('cupom-input');

    // Recupera o carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let cupomAplicado = false;

    // Atualiza a visualização do carrinho
    function atualizarCarrinho() {
        if (carrinho.length === 0) {
            carrinhoVazio.style.display = 'block';
            carrinhoConteudo.style.display = 'none';
            atualizarContadorCarrinho(0);
            return;
        }

        carrinhoVazio.style.display = 'none';
        carrinhoConteudo.style.display = 'grid';
        
        // Limpa o conteúdo atual
        carrinhoItems.innerHTML = '';
        
        // Adiciona os itens do carrinho
        carrinho.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            itemElement.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="carrinho-item-info">
                    <h3>${item.nome}</h3>
                    <p>${item.descricao}</p>
                    <div class="preco-desconto">
                        ${item.precoOriginal ? `<span class="preco-original">R$ ${item.precoOriginal}</span>` : ''}
                        <span class="preco-final">R$ ${item.preco.toFixed(2)}</span>
                    </div>
                </div>
                <div class="carrinho-item-quantidade">
                    <button class="btn-quantidade" onclick="alterarQuantidade(${index}, -1)">-</button>
                    <span class="quantidade-valor">${item.quantidade}</span>
                    <button class="btn-quantidade" onclick="alterarQuantidade(${index}, 1)">+</button>
                </div>
                <button class="btn-remover" onclick="removerItem(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            carrinhoItems.appendChild(itemElement);
        });

        atualizarValores();
    }

    // Atualiza o resumo do pedido
    function atualizarValores() {
        const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const frete = subtotal > 0 ? 15 : 0;
        const total = subtotal + frete;

        subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        freteElement.textContent = `R$ ${frete.toFixed(2)}`;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Altera a quantidade de um item
    window.alterarQuantidade = function(index, delta) {
        carrinho[index].quantidade = Math.max(1, carrinho[index].quantidade + delta);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    // Remove um item do carrinho
    window.removerItem = function(index) {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    // Atualizar contador no ícone do carrinho
    function atualizarContadorCarrinho(quantidade) {
        const contadores = document.querySelectorAll('.carrinho-contador');
        contadores.forEach(contador => {
            contador.textContent = quantidade;
        });
    }

    // Aplica cupom de desconto
    btnAplicarCupom.addEventListener('click', () => {
        const cupom = cupomInput.value.trim().toUpperCase();
        if (cupom === 'DESCONTO10' && !cupomAplicado) {
            cupomAplicado = true;
            
            // Calcula o desconto
            const subtotalAtual = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
            const valorDesconto = subtotalAtual * 0.1; // 10% de desconto
            
            // Aplica o desconto aos produtos
            carrinho = carrinho.map(item => ({
                ...item,
                precoOriginal: item.preco,
                preco: item.preco * 0.9
            }));

            // Adiciona linha de desconto no resumo
            const descontoElement = document.createElement('div');
            descontoElement.className = 'resumo-item desconto';
            descontoElement.innerHTML = `
                <span>Desconto (10%):</span>
                <span>-R$ ${valorDesconto.toFixed(2)}</span>
            `;
            
            // Insere o elemento de desconto antes do total
            const totalElement = document.querySelector('.resumo-item.total');
            totalElement.parentNode.insertBefore(descontoElement, totalElement);

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinho();
            
            // Feedback visual
            cupomInput.style.borderColor = '#4CAF50';
            mostrarNotificacao('Cupom aplicado com sucesso! 10% de desconto em toda a compra.');
            
            // Anima os preços
            document.querySelectorAll('.preco-final').forEach(preco => {
                preco.style.animation = 'none';
                preco.offsetHeight; // Força reflow
                preco.style.animation = 'precoDestaque 0.5s ease';
            });
        } else if (cupomAplicado) {
            cupomInput.style.borderColor = '#ff4444';
            mostrarNotificacao('Este cupom já foi aplicado!', 'erro');
        } else {
            cupomInput.style.borderColor = '#ff4444';
            mostrarNotificacao('Cupom inválido!', 'erro');
        }
    });

    // Função para mostrar notificação
    function mostrarNotificacao(mensagem, tipo = 'sucesso') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao ${tipo}`;
        notificacao.innerHTML = `
            <i class="fas ${tipo === 'sucesso' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${mensagem}</p>
        `;
        document.body.appendChild(notificacao);

        setTimeout(() => notificacao.classList.add('mostrar'), 100);
        setTimeout(() => {
            notificacao.classList.remove('mostrar');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    // Adiciona estilos para as notificações
    const style = document.createElement('style');
    style.textContent = `
        .notificacao {
            position: fixed;
            top: 20px;
            right: -300px;
            padding: 1rem 2rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notificacao.sucesso {
            background: #4CAF50;
            color: white;
        }

        .notificacao.erro {
            background: #ff4444;
            color: white;
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

        @keyframes precoDestaque {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); color: #ff4444; }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Finalizar compra
    document.querySelector('.btn-finalizar').addEventListener('click', () => {
        if (carrinho.length > 0) {
            alert('Compra finalizada com sucesso!');
            carrinho = [];
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinho();
        }
    });

    // Inicializa o carrinho
    atualizarCarrinho();
}); 