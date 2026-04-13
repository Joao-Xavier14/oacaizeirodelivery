/* ============================================================
   O AÇAIZEIRO — APP.JS
   Lógica de carregamento do cardápio e interatividade
   ============================================================ */

let menuData = null;

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  criarParticulas();
  await carregarCardapio();
  inicializarTabs();
});

// ============================================================
// CRIAR PARTÍCULAS NO HERO
// ============================================================
function criarParticulas() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 12 + 4;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      animation-duration: ${Math.random() * 6 + 4}s;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }
}

// ============================================================
// CARREGAR CARDÁPIO DO JSON
// ============================================================
async function carregarCardapio() {
  try {
    const resp = await fetch('/static/produtos.json');
    if (!resp.ok) throw new Error('Erro ao carregar produtos.json');
    menuData = await resp.json();
    renderizarTudo();
  } catch (err) {
    console.error('Erro ao carregar cardápio:', err);
    mostrarErro();
  }
}

function mostrarErro() {
  document.querySelector('.main-container').innerHTML += `
    <div style="text-align:center;padding:60px 20px;color:rgba(255,255,255,0.5);">
      <div style="font-size:3rem;">😕</div>
      <p style="margin-top:12px;">Erro ao carregar o cardápio. Tente novamente.</p>
    </div>
  `;
}

// ============================================================
// RENDERIZAR TUDO
// ============================================================
function renderizarTudo() {
  if (!menuData) return;

  const coposCategoria    = menuData.categorias.find(c => c.id === 'copos');
  const saladaCategoria   = menuData.categorias.find(c => c.id === 'salada-frutas');
  const milkShakeCategoria = menuData.categorias.find(c => c.id === 'milk-shake');

  if (coposCategoria)     renderizarCopos(coposCategoria);
  if (saladaCategoria)    renderizarSalada(saladaCategoria);
  if (milkShakeCategoria) renderizarMilkShake(milkShakeCategoria);
  renderizarAdicionaisEspeciais(coposCategoria);
}

// ============================================================
// RENDERIZAR COPOS
// ============================================================
function renderizarCopos(categoria) {
  // Grid de tamanhos
  const grid = document.getElementById('copesGrid');
  if (!grid) return;

  const emojis = { '330ml': '🥤', '550ml': '🫙', '770ml': '🏆' };

  grid.innerHTML = categoria.produtos.map(p => `
    <div class="produto-card ${p.destaque ? 'destaque' : ''}"
         onclick="abrirModal('${p.id}', '${encodeURIComponent(JSON.stringify(p))}', '${encodeURIComponent(categoria.nome)}')">
      ${p.destaque ? '<span class="badge-destaque">⭐ Mais Pedido</span>' : ''}
      <span class="card-emoji">${emojis[p.tamanho] || '🥤'}</span>
      <div class="card-tamanho">
        <i class="fas fa-ruler-horizontal" style="font-size:0.7rem;opacity:0.7"></i>
        ${p.tamanho}
      </div>
      <div class="card-nome">${p.nome}</div>
      <div class="card-desc">${truncarTexto(p.descricao, 70)}</div>
      <div class="card-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
      <div class="card-cta">Quero esse! 🛒</div>
    </div>
  `).join('');

  // Adicionais grátis
  const listaGratis = document.getElementById('adicionaisGratisList');
  if (!listaGratis || !categoria.adicionaisGratis) return;

  listaGratis.innerHTML = categoria.adicionaisGratis.map(a => `
    <span class="adicional-chip">✅ ${a}</span>
  `).join('');
}

// ============================================================
// RENDERIZAR SALADA DE FRUTAS
// ============================================================
function renderizarSalada(categoria) {
  const grid = document.getElementById('saladaGrid');
  if (!grid) return;

  const emojis = { '330ml': '🍓', '550ml': '🍇' };

  grid.innerHTML = categoria.produtos.map(p => `
    <div class="produto-card ${p.destaque ? 'destaque' : ''}"
         onclick="abrirModal('${p.id}', '${encodeURIComponent(JSON.stringify(p))}', '${encodeURIComponent(categoria.nome)}')">
      ${p.destaque ? '<span class="badge-destaque">⭐ Mais Pedido</span>' : ''}
      <span class="card-emoji">${emojis[p.tamanho] || '🍓'}</span>
      <div class="card-tamanho">
        <i class="fas fa-ruler-horizontal" style="font-size:0.7rem;opacity:0.7"></i>
        ${p.tamanho}
      </div>
      <div class="card-nome">${p.nome}</div>
      <div class="card-desc">${p.descricao}</div>
      <div class="card-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
      <div class="card-cta">Quero essa! 🛒</div>
    </div>
  `).join('');
}

// ============================================================
// RENDERIZAR MILK SHAKE
// ============================================================
function renderizarMilkShake(categoria) {
  const grid = document.getElementById('milkShakeGrid');
  if (!grid) return;

  const emojis = {
    'ms-acai':       '🥛',
    'ms-nutella':    '🍫',
    'ms-ninho':      '🤍',
    'ms-ovomaltine': '🌾'
  };

  const cores = {
    'ms-acai':       '#7b3fae',
    'ms-nutella':    '#5c3317',
    'ms-ninho':      '#4a6fa5',
    'ms-ovomaltine': '#8b5e3c'
  };

  grid.innerHTML = categoria.produtos.map(p => `
    <div class="ms-card ${p.destaque ? 'destaque' : ''}"
         onclick="abrirModal('${p.id}', '${encodeURIComponent(JSON.stringify(p))}', '${encodeURIComponent(categoria.nome)}')"
         style="border-top: 3px solid ${cores[p.id] || 'rgba(245,197,24,0.3)'};">
      ${p.destaque ? '<span class="badge-destaque">⭐ Favorito</span>' : ''}
      <div class="ms-header">
        <div class="ms-emoji">${emojis[p.id] || '🥛'}</div>
        <div class="ms-info">
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
        </div>
      </div>
      <div class="ms-footer">
        <span class="ms-tamanho">
          <i class="fas fa-bottle-water" style="font-size:0.7rem;margin-right:4px;"></i>
          ${p.tamanho}
        </span>
        <span class="ms-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
  `).join('');
}

// ============================================================
// RENDERIZAR ADICIONAIS ESPECIAIS
// ============================================================
function renderizarAdicionaisEspeciais(coposCategoria) {
  const container = document.getElementById('adicionaisEspeciaisContainer');
  if (!container || !coposCategoria?.adicionaisEspeciais) return;

  const { cremes, outros } = coposCategoria.adicionaisEspeciais;

  // Seção Grátis
  const gratisList = coposCategoria.adicionaisGratis || [];
  const gratisHTML = `
    <div class="ae-section" style="border-top: 3px solid rgba(245,197,24,0.5);">
      <div class="ae-section-title">
        <span>🎁</span> Adicionais Grátis
        <span style="margin-left:auto;font-size:0.7rem;font-weight:500;
          background:rgba(245,197,24,0.15);padding:3px 8px;border-radius:10px;
          color:rgba(255,255,255,0.7);">Incluso</span>
      </div>
      ${gratisList.map(a => `
        <div class="ae-item">
          <span class="ae-nome">✅ ${a}</span>
          <span class="ae-preco" style="background:rgba(0,200,100,0.1);border-color:rgba(0,200,100,0.3);color:#4ade80;">Grátis</span>
        </div>
      `).join('')}
    </div>
  `;

  // Seção Cremes
  const cremesHTML = cremes ? `
    <div class="ae-section" style="border-top: 3px solid #9b5cd6;">
      <div class="ae-section-title">
        <span>🍦</span> Cremes Especiais
        <span style="margin-left:auto;font-size:0.7rem;font-weight:500;
          background:rgba(155,92,214,0.2);padding:3px 8px;border-radius:10px;
          color:rgba(255,255,255,0.7);">Premium</span>
      </div>
      ${cremes.map(a => `
        <div class="ae-item">
          <span class="ae-nome">🌟 ${a.nome}</span>
          <span class="ae-preco">+ R$ ${a.preco.toFixed(2).replace('.', ',')}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  // Seção Outros
  const outrosHTML = outros ? `
    <div class="ae-section" style="border-top: 3px solid #f5c518;">
      <div class="ae-section-title">
        <span>✨</span> Outros Adicionais
      </div>
      ${outros.map(a => `
        <div class="ae-item">
          <span class="ae-nome">🔸 ${a.nome}</span>
          <span class="ae-preco">+ R$ ${a.preco.toFixed(2).replace('.', ',')}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  container.innerHTML = gratisHTML + cremesHTML + outrosHTML;
}

// ============================================================
// TABS DE NAVEGAÇÃO
// ============================================================
function inicializarTabs() {
  const botoes = document.querySelectorAll('.tab-btn');
  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;

      // Atualizar botões
      botoes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Mostrar painel correto
      document.querySelectorAll('.category-panel').forEach(p => p.classList.remove('active'));
      const painel = document.getElementById(`panel-${cat}`);
      if (painel) painel.classList.add('active');

      // Scroll suave
      document.getElementById('menuSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================================
// MODAL DE PRODUTO
// ============================================================
function abrirModal(id, produtoEncoded, categoriaEncoded) {
  const produto   = JSON.parse(decodeURIComponent(produtoEncoded));
  const categoria = decodeURIComponent(categoriaEncoded);

  const emojiMap = {
    'copo-330': '🥤', 'copo-550': '🫙', 'copo-770': '🏆',
    'salada-330': '🍓', 'salada-550': '🍇',
    'ms-acai': '🥛', 'ms-nutella': '🍫', 'ms-ninho': '🤍', 'ms-ovomaltine': '🌾'
  };

  const emoji = emojiMap[id] || '🫐';
  const precoFmt = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
  const mensagemWpp = encodeURIComponent(
    `Olá! Quero pedir:\n\n🫐 *${produto.nome}*\n📏 Tamanho: ${produto.tamanho}\n💰 Valor: ${precoFmt}\n\n${produto.descricao}`
  );

  document.getElementById('modalContent').innerHTML = `
    <span class="modal-emoji">${emoji}</span>
    <div class="modal-title">${produto.nome}</div>
    <div class="modal-tamanho">
      <i class="fas fa-tag" style="margin-right:4px;opacity:0.5"></i>
      ${categoria} • ${produto.tamanho}
    </div>
    <div class="modal-desc">${produto.descricao}</div>
    <div class="modal-preco-box">
      <div class="modal-preco-label">Preço</div>
      <div class="modal-preco-valor">${precoFmt}</div>
    </div>
    <button class="modal-btn-pedido" onclick="pedirWhatsApp('${mensagemWpp}')">
      <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i>
      Pedir pelo WhatsApp
    </button>
  `;

  document.getElementById('produtoModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('produtoModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Fechar modal clicando fora
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('produtoModal');
  if (e.target === overlay) closeModal();
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ============================================================
// PEDIDO VIA WHATSAPP
// ============================================================
function pedirWhatsApp(mensagemEncoded) {
  // Substitua o número real do estabelecimento aqui
  const numero = '5500000000000';
  const url = `https://wa.me/${numero}?text=${mensagemEncoded}`;
  window.open(url, '_blank');
}

// ============================================================
// SCROLL PARA O MENU
// ============================================================
function scrollToMenu() {
  document.getElementById('menuSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// UTILITÁRIOS
// ============================================================
function truncarTexto(texto, limite) {
  if (!texto) return '';
  return texto.length > limite ? texto.substring(0, limite) + '…' : texto;
}
