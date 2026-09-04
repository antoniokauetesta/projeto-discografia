const state = { evidence: new Set(), path: null, choice: null };
const evidenceNames = {
  tape: "Fita cassete",
  photo: "Fotografia",
  document: "Documento 1973-13",
  poem: "Poema censurado",
};
const paths = {
  tape: {
    label: "A FITA",
    kicker: "Pista sonora",
    title: "A fita<br>tem <em>duas vozes.</em>",
    text: "A primeira camada é a voz de Raul, baixa e apressada. Ele menciona <strong>Fala</strong> como quem aponta para uma testemunha. Depois, um ruído: relógio, sirene, três batidas. Quando o volume aumenta, surge uma frase que não era para estar ali: “Arquivo sete”.",
    artifact: "tape",
  },
  show: {
    label: "O ÚLTIMO SHOW",
    kicker: "Pista física",
    title: "O palco<br>não estava <em>vazio.</em>",
    text: "No camarim, o caderno de Raul está aberto em uma página arrancada. No verso do cartaz, alguém escreveu <strong>Primavera nos Dentes</strong>. O microfone ainda guarda uma gravação curta: “Não procure quem aparece. Procure quem foi retirado.”",
    artifact: "photo",
  },
  archive: {
    label: "O ARQUIVO",
    kicker: "Documento confidencial",
    title: "Um nome<br>foi <em>riscado.</em>",
    text: "O arquivo 1973-13 descreve Raul como “elemento ausente”. A assinatura de Artur aparece no rodapé, mas a tinta é recente. Entre as linhas cobertas, uma palavra sobrevive: <strong>Assim Assado</strong>. Duas versões. Uma só pode ser oficial.",
    artifact: "document",
  },
};
const $ = (selector) => document.querySelector(selector);
function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
function addEvidence(key) {
  state.evidence.add(key);
  const item = document.querySelector(`[data-evidence="${key}"]`);
  if (item) {
    item.classList.add("found");
    item.querySelector(".evidence-status").textContent = "✓";
    item.querySelector("small").textContent = "registrada";
  }
  $("#map-progress").textContent = `${state.evidence.size} / 4 evidências`;
}
function renderArtifact(type) {
  const artifact = $("#artifact");
  artifact.className = `artifact artifact-${type}`;
  artifact.innerHTML =
    type === "document"
      ? '<div class="document-lines"><b>ARQUIVO Nº 1973-13</b><span>RAUL [████████]</span><span>CLARA [████]</span><span>ARTUR VASCONCELOS</span><i>CONFIDENCIAL</i></div>'
      : type === "photo"
        ? '<div class="photo-frame"><span>FLORIANÓPOLIS / 73</span></div>'
        : '<div class="cassette-label"><b>VOZ 02</b><span>09.1973</span></div>';
}
function openPath(pathKey) {
  const path = paths[pathKey];
  state.path = pathKey;
  $("#path-label").textContent = path.label;
  $("#investigation-kicker").textContent = path.kicker;
  $("#investigation-title").innerHTML = path.title;
  $("#investigation-text").innerHTML = `<p>${path.text}</p>`;
  $("#choice-panel").hidden = true;
  $("#investigate-button").hidden = false;
  renderArtifact(path.artifact);
  $("#investigation").hidden = false;
  addEvidence(
    pathKey === "tape" ? "tape" : pathKey === "show" ? "photo" : "document",
  );
  scrollToId("investigation");
}
function revealInvestigation() {
  $("#investigate-button").hidden = true;
  $("#choice-panel").hidden = false;
  const extra =
    state.path === "show"
      ? "poem"
      : state.path === "archive"
        ? "photo"
        : "document";
  addEvidence(extra);
}
function makeChoice(choice) {
  state.choice = choice;
  $("#choice-panel").hidden = true;
  const message =
    choice === "trust"
      ? "Clara escuta a fita até o fim. Ela reconhece a sirene: vem do arquivo administrativo. Antes de ir, entrega a você uma fotografia que Raul havia escondido."
      : choice === "hide"
        ? "Você guarda o vestígio dentro do caderno. Na margem, encontra uma rosa desenhada e uma data: 1971. A pista parece perigosa demais para circular."
        : "Você fecha o caderno. Sem testemunho, a versão oficial volta a ocupar todo o espaço. O caso será arquivado.";
  $("#investigation-text").insertAdjacentHTML(
    "beforeend",
    `<p class="new-clue"><strong>${message}</strong></p>`,
  );
  if (choice !== "silence") addEvidence(choice === "trust" ? "photo" : "poem");
  setTimeout(showEnding, 500);
}
function showEnding() {
  const count = state.evidence.size;
  let ending;
  if (count >= 3 && state.choice === "trust")
    ending = {
      kicker: "Final 01 · A verdade",
      title: "A verdade<br>vem a <em>público.</em>",
      text: "As pistas se encaixam: Raul descobriu uma operação para apagar nomes de documentos oficiais. Artur ajudava a esconder pessoas, mas alguém usava o arquivo para fazer o desaparecimento parecer uma fuga. A cópia dos registros chega ao jornal. Raul continua desaparecido. Sua história, não.",
      quote: "“Algumas pessoas desaparecem. Suas histórias, não.”",
    };
  else if (state.choice === "hide")
    ending = {
      kicker: "Final 02 · A fuga",
      title: "Sobreviver<br>também é <em>resistir.</em>",
      text: "Você entende que publicar os nomes agora colocaria Clara e outras pessoas em risco. A fita some do arquivo. Meses depois, uma nova mensagem chega sem remetente: Raul está vivo, sob outro nome. A investigação não termina com uma denúncia, mas com uma memória preservada.",
      quote: "“Às vezes, sobreviver também é resistir.”",
    };
  else
    ending = {
      kicker: "Final 03 · O silêncio",
      title: "O silêncio<br>vence por <em>enquanto.</em>",
      text: "As versões oficiais se sobrepõem às pistas. Sem evidências suficientes, o caso volta para a gaveta. O nome de Raul permanece riscado e a chuva apaga as últimas marcas do caminho.",
      quote: "“Quando as pistas desaparecem, o silêncio pode vencer.”",
    };
  $("#ending-kicker").textContent = ending.kicker;
  $("#ending-title").innerHTML = ending.title;
  $("#ending-text").textContent = ending.text;
  $("#ending-quote").textContent = ending.quote;
  $("#ending").hidden = false;
  scrollToId("ending");
}
function reset() {
  state.evidence.clear();
  state.path = null;
  state.choice = null;
  document.querySelectorAll(".evidence-list li").forEach((item) => {
    item.classList.remove("found");
    item.querySelector(".evidence-status").textContent = "?";
    item.querySelector("small").textContent = "não examinada";
  });
  $("#map-progress").textContent = "0 / 4 evidências";
  $("#investigation").hidden = true;
  $("#ending").hidden = true;
  scrollToId("hero");
}
$("#start-button").addEventListener("click", () => scrollToId("context"));
$("#enter-case").addEventListener("click", () => scrollToId("case"));
document
  .querySelectorAll(".path-card")
  .forEach((card) =>
    card.addEventListener("click", () => openPath(card.dataset.path)),
  );
$("#investigate-button").addEventListener("click", revealInvestigation);
document
  .querySelectorAll(".choice-button")
  .forEach((button) =>
    button.addEventListener("click", () => makeChoice(button.dataset.choice)),
  );
$("#reset-button").addEventListener("click", reset);
$("#reset-top").addEventListener("click", reset);
