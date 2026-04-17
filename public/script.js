document.addEventListener('DOMContentLoaded', () => {
    
    const botaoAdicionar = document.getElementById('calcular-imc');
    const botaoSalvar    = document.getElementById('salvar-dados');
    const listaPedidos   = document.getElementById('lista-de-dados');
    const totalElemento  = document.getElementById('resultado');
    const pesoInput      = document.getElementById('peso');
    const alturaInput    = document.getElementById('altura');

    
    let pedidosData = [];

    
    botaoAdicionar.addEventListener('click', function() {
        
        const peso = parseFloat(pesoInput.value.replace(',', '.'));
        const altura = parseFloat(alturaInput.value.replace(',', '.'));

        
        if (!isNaN(peso) && peso > 0 && !isNaN(altura) && altura > 0) {
            
            const imc = peso / (altura * altura);
            let classificacao = "";

            if (imc < 18.5) classificacao = "Abaixo do peso";
            else if (imc < 24.9) classificacao = "Peso normal";
            else if (imc < 29.9) classificacao = "Sobrepeso";
            else classificacao = "Obesidade";

            
            totalElemento.textContent = `${imc.toFixed(2)} - ${classificacao}`;

           
            const novoPedido = {
                Peso: `Peso: ${peso}kg`, 
                Altura: altura,
                imc: imc.toFixed(2),
                resultado: classificacao
            };
            pedidosData.push(novoPedido);

            if (listaPedidos) {
                const li = document.createElement('li');
                li.innerHTML = `
                    IMC: ${imc.toFixed(2)} (${classificacao})
                    <button class="remover">Remover</button>
                `;
                listaPedidos.appendChild(li);

                
                li.querySelector('.remover').addEventListener('click', function() {
                    pedidosData = pedidosData.filter(p => p.imc !== imc.toFixed(2));
                    listaPedidos.removeChild(li);
                });
            }

            pesoInput.value = "";
            alturaInput.value = "";

        } else {
            alert("Por favor, preencha os dados corretamente.");
        }
    });

    
    botaoSalvar.addEventListener('click', function() {
        if (pedidosData.length === 0) {
            alert('Calcule um IMC antes de salvar');
            return;
        }

        
        const dadosParaSalvar = {
            pedidos: pedidosData
        };

        fetch('http://localhost:3000/salvar', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dadosParaSalvar)
        })
        .then(response => response.text())
        .then(resposta => {
            alert("Resposta do Servidor: " + resposta);
            pedidosData = [];
            totalElemento.textContent = "0.00";
            if (listaPedidos) listaPedidos.innerHTML = "";
        })
        .catch(error => {
            console.error('Erro ao conectar:', error);
            alert("Erro: O servidor local não está ligado.");
        });
    });
});
