/*=========================================================
    PA-KUA AVALIAÇÕES
    PDF.JS - GERADOR 3x3 DEFINITIVO (ENCAIXE PERFEITO A4)
=========================================================*/

$(function(){

    $("#btnGerarPDF").on("click", function(){
        
        const listaCards = document.getElementById("listaCards");
        const cards = [...listaCards.querySelectorAll(".card")];

        if(cards.length === 0){
            alert("Nenhum aluno cadastrado para gerar o PDF.");
            return;
        }

        // 1. Feedback visual no botão
        const $botao = $(this);
        const textoOriginal = $botao.html();
        $botao.prop("disabled", true).html("⏳ Montando PDF...");

        const modalidade = localStorage.getItem("modalidadeEscolhida") || "Pa-Kua";

        // 2. A CAIXA INVISÍVEL
        const hideBox = document.createElement("div");
        hideBox.style.position = "fixed";
        hideBox.style.top = "0";
        hideBox.style.left = "0";
        hideBox.style.width = "0";
        hideBox.style.height = "0";
        hideBox.style.overflow = "hidden";
        hideBox.style.zIndex = "-9999";

        // 3. CONTAINER DO PDF (Ajustado para 794px, que é a largura exata padrão de um A4 em pixels a 96 DPI)
        const wrapper = document.createElement("div");
        wrapper.style.width = "794px"; 
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.padding = "15px";
        wrapper.style.boxSizing = "border-box";

        // Título compacto
        const titulo = document.createElement("h1");
        titulo.innerText = "Avaliação - " + modalidade;
        titulo.style.textAlign = "center";
        titulo.style.fontFamily = "sans-serif";
        titulo.style.color = "#2c3e50";
        titulo.style.marginBottom = "15px";
        titulo.style.fontSize = "20px";
        wrapper.appendChild(titulo);

        // Grid 3x3 com espaçamento seguro para A4
        const grid = document.createElement("div");
        grid.className = "pdf-grid";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(3, 1fr)";
        grid.style.gap = "10px"; 

        // Clona os cards e aplica uma classe de redução de escala para o PDF
        cards.forEach((card, index) => {
            const clone = card.cloneNode(true);
            clone.classList.add("pdf-card-ajustado");
            
            // Trava os estilos
            clone.style.animation = "none";
            clone.style.transition = "none";
            clone.style.transform = "none";
            clone.style.opacity = "1";
            clone.style.margin = "0";
            clone.style.padding = "10px"; // Reduz o padding interno do card no PDF
            
            // Quebra de página a cada 9 alunos
            if (index > 0 && index % 9 === 0) {
                clone.classList.add("quebra-pagina");
            }
            
            grid.appendChild(clone);
        });

        wrapper.appendChild(grid);
        hideBox.appendChild(wrapper);
        document.body.appendChild(hideBox);

        // 4. OPÇÕES DO PDF (Sincronizadas com 794px)
        const opt = {
            margin: 5,
            filename: `Avaliacoes_${modalidade}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: "#ffffff",
                windowWidth: 794 // Sincronizado perfeitamente com a largura da folha A4
            },
            jsPDF: { 
                unit: "mm", 
                format: "a4", 
                orientation: "portrait" 
            }
        };

        // 5. GERAÇÃO
        html2pdf()
            .set(opt)
            .from(wrapper)
            .save()
            .then(() => {
                hideBox.remove();
                $botao.prop("disabled", false).html(textoOriginal);
            })
            .catch(err => {
                console.error("Erro no PDF:", err);
                hideBox.remove();
                $botao.prop("disabled", false).html(textoOriginal);
                alert("Houve um erro na geração. Tente novamente.");
            });

    });

});