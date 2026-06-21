
let musicaAtualChave = null;
let synthController = null;
let tomAtualSemitons = 0; 

async function carregarMusica(chave, botaoClicado) {
    musicaAtualChave = chave;
    
    document.querySelectorAll('.btn-musica').forEach(btn => btn.classList.remove('ativo'));
    if (botaoClicado) {
        botaoClicado.classList.add('ativo');
    }

    // Configura o andamento padrão inicial da música direto no campo numérico
    const musica = musicas[chave];
    document.getElementById('input-andamento').value = musica.bpmPadrao;

    // Reseta a transposição
    tomAtualSemitons = 0;
    atualizarTextoTom();

    document.getElementById('painel-estudo').style.display = "grid";
    document.getElementById('area-partitura').style.display = "block";

    await atualizarMusicaModificada();
}

function mudarTonalidade(valor) {
    tomAtualSemitons += valor;
    atualizarTextoTom();
    atualizarMusicaModificada();
}

function atualizarTextoTom() {
    const elemento = document.getElementById('txt-tom');
    if (tomAtualSemitons === 0) {
        elemento.textContent = "Original";
    } else if (tomAtualSemitons > 0) {
        elemento.textContent = "+" + tomAtualSemitons + " Semitom" + (tomAtualSemitons > 1 ? "s" : "");
    } else {
        elemento.textContent = tomAtualSemitons + " Semitom" + (tomAtualSemitons < -1 ? "s" : "");
    }
}

async function atualizarMusicaModificada() {
    if (!musicaAtualChave) return;
    
    const musica = musicas[musicaAtualChave];
    let bpmDigitado = parseInt(document.getElementById('input-andamento').value, 10);
    
    // Segurança para evitar valores bizarros ou vazios
    if (isNaN(bpmDigitado) || bpmDigitado < 30) {
        bpmDigitado = musica.bpmPadrao;
        document.getElementById('input-andamento').value = bpmDigitado;
    }

    document.getElementById('nome-da-musica').textContent = musica.titulo;

    // Injeta a tag Q: (velocidade) diretamente no texto do ABC antes de renderizar.
    // Isso garante que o motor de áudio e o visual leiam a velocidade absoluta digitada.
    const abcModificado = musica.abcBase.replace("K:C", `Q:1/4=${bpmDigitado}\nK:C`);

    // 1. Desenha a partitura com o transpose visual
    const visualObj = ABCJS.renderAbc("desenho-partitura", abcModificado, { 
        responsive: "resize",
        add_classes: true,
        visualTranspose: tomAtualSemitons
    });

    // 2. Cria o Áudio correspondente
    try {
        if (synthController) {
            synthController.disable();
        }

        if (ABCJS.synth.supportsAudio()) {
            synthController = new ABCJS.synth.SynthController();
            
            synthController.load("#player-audio", null, {
                displayLoop: true,
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayWarp: false
            });

            const synthOptions = {
                chordsOff: true,
                midiTranspose: tomAtualSemitons // Transpõe o áudio
            };

            const createSynth = new ABCJS.synth.CreateSynth();
            await createSynth.init({ visualObj: visualObj[0] });
            await synthController.setTune(visualObj[0], false, synthOptions);
        } else {
            document.getElementById('player-audio').innerHTML = "<p style='color:red;'>O áudio não é suportado neste navegador.</p>";
        }
    } catch (error) {
        console.error("Erro na reprodução de áudio:", error);
    }
}