/*=========================================================
    PA-KUA AVALIAÇÕES
    CONFIG V2.0
=========================================================*/

const CONFIG = {

    /*=====================================================
        SISTEMA
    =====================================================*/
    sistema: {
        nome: "Pa-Kua Avaliações",
        versao: "2.0",
        modalidadePadrao: "Pa-Kua",
        idioma: "pt-BR"
    },

    /*=====================================================
        IMAGENS
    =====================================================*/
    imagens: {
        avatarPadrao: "assets/avatar-padrao.png",
        logoSistema: "assets/logo.png"
    },

    /*=====================================================
        PDF (Unificado)
    =====================================================*/
    pdf: {
        formato: "a4",
        orientacao: "portrait",
        margem: 8,
        escala: 2,
        qualidadeImagem: 1,
        cardsPorLinha: 2,
        linhasPorPagina: 3,
        mostrarCabecalho: true,
        mostrarRodape: true,
        mostrarNumeroPagina: true,
        mostrarDataGeracao: true,
        mostrarLogo: true,
        
        // Modos de Impressão
        modoPadrao: "compacto",
        
        compacto: {
            cardsPorPagina: 9,
            colunas: 3,
            orientacao: "portrait"
        },

        ficha: {
            cardsPorPagina: 1,
            colunas: 1,
            orientacao: "portrait"
        }
    },

    /*=====================================================
        CARDS
    =====================================================*/
    cards: {
        quantidadeQuadrantes: 8,
        quadrantesPorGrupo: 4,
        gruposPorLinha: 4,
        mostrarTelefone: true,
        mostrarIdade: true,
        mostrarRecinto: true,
        mostrarOrientador: true,
        mostrarTempoFaixa: true,
        mostrarPagamento: true,
        mostrarBadges: true
    },

    /*=====================================================
        LAYOUT
    =====================================================*/
    layout: {
        larguraMaxima: 1450,
        colunasTela: "repeat(auto-fill,minmax(360px,1fr))",
        colunasPDF: "repeat(2,1fr)",
        raioCard: 18,
        paddingCard: 20,
        gapCards: 28,
        gapPDF: 12
    },

    /*=====================================================
        TAMANHOS
    =====================================================*/
    tamanhos: {
        fotoTela: 90,
        fotoPDF: 55,
        tituloTela: 22,
        tituloPDF: 14,
        textoTela: 14,
        textoPDF: 11,
        quadradoTela: 60,
        quadradoPDF: 38
    },

    /*=====================================================
        FAIXAS (Todas incluídas)
    =====================================================*/
    faixas: {
        Branca: { fundo: "#ffffff", borda: "#d5d5d5", texto: "#222" },
        Amarela: { fundo: "#fff9de", borda: "#f1c40f", texto: "#222" },
        Laranja: { fundo: "#fdf2e9", borda: "#e67e22", texto: "#222" },
        Verde: { fundo: "#e9f7ef", borda: "#27ae60", texto: "#222" },
        Cinza: { fundo: "#f2f3f4", borda: "#7f8c8d", texto: "#222" },
        Azul: { fundo: "#eaf2f8", borda: "#2980b9", texto: "#222" },
        Marrom: { fundo: "#f5eee6", borda: "#795548", texto: "#222" },
        Vermelha: { fundo: "#fdedec", borda: "#c0392b", texto: "#222" },
        Preta: { fundo: "#eeeeee", borda: "#222222", texto: "#111" },
        "I Grau": { fundo: "#2c3e50", borda: "#000000", texto: "#ffffff" },
        "II Grau": { fundo: "#2c3e50", borda: "#000000", texto: "#ffffff" },
        "III Grau": { fundo: "#2c3e50", borda: "#000000", texto: "#ffffff" }
    },

    /*=====================================================
        IMPRESSÃO
    =====================================================*/
    impressao: {
        removerAnimacoes: true,
        removerSombras: true,
        removerHover: true,
        reduzirFoto: true,
        reduzirFontes: true,
        reduzirQuadrantes: true,
        ocultarBotaoEditar: true
    },

    /*=====================================================
        DEBUG
    =====================================================*/
    debug: {
        ativo: false,
        mostrarLogs: false
    }

};