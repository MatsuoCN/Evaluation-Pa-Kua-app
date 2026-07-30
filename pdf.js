/*=========================================================
    PA-KUA AVALIAÇÕES
    PDF.JS - GERADOR 3x3 (FLEXBOX E PAGEBREAK NATIVO)
=========================================================*/

$(function(){

    $("#btnGerarPDF").on("click", function(){
        
        const listaCards = document.getElementById("listaCards");
        const cards = [...listaCards.querySelectorAll(".card")];

        if(cards.length === 0){
            alert("Nenhum aluno cadastrado para gerar o PDF.");
            return;
        }

        const $botao = $(this);
        const textoOriginal = $botao.html();
        $botao.prop("disabled", true).html("⏳ Montando Arquivo...");

        const modalidade = localStorage.getItem("modalidadeEscolhida") || "Pa-Kua";

        // 1. ESCONDER A INTERFACE ORIGINAL COM SEGURANÇA
        const elementosOcultos = [];
        $("body > *").each(function() {
            if (this.tagName !== "SCRIPT" && this.tagName !== "STYLE") {
                elementosOcultos.push({ 
                    elemento: this, 
                    display: $(this).css("display") 
                });
                $(this).hide(); 
            }
        });

        // 2. CRIAR A FOLHA A4 PRINCIPAL
        const wrapper = document.createElement("div");
        wrapper.id = "pdf-temp-wrapper";
        wrapper.style.width = "794px";
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.padding = "20px";
        wrapper.style.margin = "0"; 
        wrapper.style.boxSizing = "border-box";
        
        const titulo = document.createElement("h1");
        titulo.innerText = "Avaliação - " + modalidade;
        titulo.style.textAlign = "center";
        titulo.style.fontFamily = "sans-serif";
        titulo.style.color = "#2c3e50";
        titulo.style.marginBottom = "20px";
        titulo.style.fontSize = "22px";
        wrapper.appendChild(titulo);

        // 3. TROCAMOS GRID POR FLEXBOX (Evita colapso e cortes na imagem)
        const flexContainer = document.createElement("div");
        flexContainer.style.display = "flex";
        flexContainer.style.flexWrap = "wrap";
        flexContainer.style.gap = "10px";
        flexContainer.style.justifyContent = "flex-start";

        cards.forEach((card, index) => {
            const clone = card.cloneNode(true);
            clone.classList.add("card-pdf-compacto");
            
            // Força a largura para 3 por linha no flexbox (33.33% menos o espaço do gap)
            clone.style.width = "calc(33.333% - 7px)"; 
            clone.style.animation = "none";
            clone.style.transition = "none";
            clone.style.transform = "none";
            clone.style.opacity = "1";
            clone.style.margin = "0";
            clone.style.boxSizing = "border-box";
            
            // Adiciona a classe de quebra a cada 9 cartões
            if (index > 0 && index % 9 === 0) {
                clone.classList.add("quebra-pagina-pdf");
            }
            
            flexContainer.appendChild(clone);
        });

        wrapper.appendChild(flexContainer);
        document.body.appendChild(wrapper);

        // Zera o scroll da tela real
        window.scrollTo(0, 0);

        // 4. CAPTURAR A FOTO (Sem windowWidth forçado, deixando a lib calcular)
        setTimeout(() => {
            const opt = {
                margin:       [5, 5, 5, 5],
                filename:     `Avaliacoes_${modalidade}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: "#ffffff",
                    scrollY: 0,
                    scrollX: 0
                    // windowWidth removido para evitar cortes laterais em resoluções diferentes
                },
                jsPDF:        { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                },
                // Configuração nativa poderosa para não cortar os cards na divisão da folha
                pagebreak: { mode: ['css', 'legacy'], before: '.quebra-pagina-pdf' } 
            };

            html2pdf()
                .set(opt)
                .from(wrapper)
                .save()
                .then(() => {
                    // Restaurar tudo ao normal
                    wrapper.remove(); 
                    elementosOcultos.forEach(item => {
                        $(item.elemento).css("display", item.display);
                    });
                    window.scrollTo(0, 0);
                    $botao.prop("disabled", false).html(textoOriginal);
                })
                .catch(err => {
                    console.error("Erro no PDF:", err);
                    wrapper.remove();
                    elementosOcultos.forEach(item => $(item.elemento).css("display", item.display));
                    $botao.prop("disabled", false).html(textoOriginal);
                    alert("Ocorreu um erro ao gerar o PDF.");
                });
        }, 800);

    });

});