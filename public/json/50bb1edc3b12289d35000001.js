// (DOM) loaded
document.addEventListener("DOMContentLoaded", function () {
  // popcorn instance
  var pop = Popcorn('#video');

  pop.image({
    "start": 10,
    "end": 30,
    "target": "panelImage",
    "src": "/lessons/50bb1edc3b12289d35000001/img1.jpg"
  }).footnote({
    "start": 20,
    "end": 27,
    "target": "panelAsk",
    "text": "Caricatura de finales del siglo XIX"
  }).footnote({
    "start": 44,
    "end": 51,
    "target": "panelAsk",
    "text": "<div class=\"question\"><h4>¿Que presidente dio las primeras leyes a favor de la raza negra en el Perú?</h4><div><label class=\"radio\"><input type=\"radio\" name=\"preg1\" value=0 />José Rufino Echenique Benavente</label></div><div><label class=\"radio\"><input type=\"radio\" name=\"preg1\" value=1 />Ramón Castilla y Marquesado</label></div><div><label class=\"radio\"><input type=\"radio\" name=\"preg1\" value=2 />Manuel Pardo y Lavalle</label></div></div><div><input type=\"button\" class=\"btn btn-success\" value=\"Enviar\" /></div>"
  }).image({
    "start": 81,
    "end": 128,
    "target": "panelImage",
    "src": "/lessons/50bb1edc3b12289d35000001/img2.jpg"
  }).footnote({
    "start": 108,
    "end": 114,
    "target": "panelAsk",
    "text": "Uno de los aportes de su gobierno fue la llegada de los primeros transportes publicos, el tranvía y alumbrado eléctrico."
  }).footnote({
    "start": 115,
    "end": 122,
    "target": "panelAsk",
    "text": "<div class=\"question\"><h4>¿Que aves son guaneras?</h4><div><label class=\"checkbox\"><input type=\"checkbox\" value=0 />guanay</label></div><div><label class=\"checkbox\"><input type=\"checkbox\" value=1 />paloma</label></div><div><label class=\"checkbox\"><input type=\"checkbox\" value=1 />pelícano</label></div><div><label class=\"checkbox\"><input type=\"checkbox\" value=2 />piquero</label></div></div><div><input type=\"button\" class=\"btn btn-success\" value=\"Enviar\" /></div>"
  }).image({
    "start": 140,
    "end": 260,
    "target": "panelImage",
    "src": "/lessons/50bb1edc3b12289d35000001/img3.jpg"
  }).image({
    "start": 381,
    "end": 403,
    "target": "panelImage",
    "src": "/lessons/50bb1edc3b12289d35000001/img7.jpg"
  }).wikipedia({
    "start": 381,
    "end": 403,
    "target": "panelAsk",
    "numOfWords": 100,
    "src": "http://es.wikipedia.org/wiki/Jorge_Basadre"
  }).image({
    "start": 426,
    "end": 427,
    "target": "panelImage",
    "src": "/lessons/50bb1edc3b12289d35000001/img6.jpg"
  });
  // play
  pop.play();
  pop.cue(50, function() {
    this.pause();
    setTimeout(function(){pop.play();}, 5000);
  });
  pop.cue(120, function() {
    this.pause();
    setTimeout(function(){pop.play();}, 5000);
  });

}, false);
